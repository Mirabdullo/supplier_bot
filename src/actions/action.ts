import { Composer } from "telegraf";
import { Orders } from "../models/order.model";
import { bot } from "../core";
import { User } from "../models/user.model";
import { sendPageWithButton } from "../libs/products.service";
import { createWarehouseProduct } from "../libs/warehouse.service";
import { sendAcceptedOrders } from "../libs/accepted_order";
import { sendOrderInfo } from "../libs/order_by_id";
import { sendActiveOrders } from "../libs/active_orders";
import { sendRejectedOrders } from "../libs/rejected_orders";
import { searchOrders } from "../libs/search_orders";

const composer = new Composer();

composer.action(/(^accept=[\s\S])[\w\W]+/g, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id;
    let text: any;
    let messageId = ctx.update.callback_query.message?.message_id;
    if (ctx.update.callback_query && ctx.update.callback_query.message) {
        const message = ctx.update.callback_query.message;
        if ("text" in message) {
            text = message.text;
        }
    }
    const id = ctx.match[0].split("=")[1];

    const product = await Orders.findByPk(id);

    if (product?.dataValues.status === "ACCEPTED") {
        await ctx.answerCbQuery("Заказ принят через сайт!");
        await ctx.editMessageText(text + "\n\n<b>✅Принял</b>", {
            parse_mode: "HTML",
        });
    }

    if (product?.dataValues.status === "REJECTED") {
        await ctx.answerCbQuery("Заказ отменен через сайт!");
        await ctx.editMessageText(text + "\n\n<b>🚫Отменено</b>", {
            parse_mode: "HTML",
        });
    }

    let ifexists;
    if (product?.dataValues.id && telegramId) {
        ifexists = await createWarehouseProduct(ctx, product?.dataValues?.id, telegramId);
    }

    if (!ifexists) {
        return;
    }

    console.log("accept: ", product?.dataValues?.id);
    if (product && "status" in product) {
        product.status = "ACCEPTED";
        await product.save();
    }

    await ctx.editMessageText(text + "\n\n<b>✅Принял</b>", {
        parse_mode: "HTML",
    });

    setTimeout(() => {
        ctx.deleteMessage(messageId);
    }, 5000);
});

composer.action(/(^reject=[\s\S])[\w\W]+/g, async (ctx) => {
    let text: any;

    let messageId = ctx.update.callback_query.message?.message_id;

    if (ctx.update.callback_query && ctx.update.callback_query.message) {
        const message = ctx.update.callback_query.message;
        if ("text" in message) {
            text = message.text;
        }
    }
    const id = ctx.match[0].split("=")[1];
    const product = await Orders.findByPk(id);
    console.log("reject: ", product?.dataValues?.id);
    if (product?.dataValues.status === "ACCEPTED") {
        await ctx.answerCbQuery("Заказ принят через сайт!");
        await ctx.editMessageText(text + "\n\n<b>✅Принял</b>", {
            parse_mode: "HTML",
        });
    }

    if (product?.dataValues.status === "REJECTED") {
        await ctx.answerCbQuery("Заказ отменен через сайт!");
        await ctx.editMessageText(text + "\n\n<b>🚫Отменено</b>", {
            parse_mode: "HTML",
        });
    }

    if (product && "status" in product) {
        product.status = "REJECTED";
        await product.save();
    }

    await ctx.editMessageText(text + "\n\n<b>🚫Отменено</b>", {
        parse_mode: "HTML",
    });

    setTimeout(() => {
        ctx.deleteMessage(messageId);
    }, 5000);
});

composer.action("start", async (ctx) => {
    let id = ctx.from?.id;
    const user = await User.findOne({ where: { bot_id: id } });
    console.log(ctx.update.callback_query.message);
    let messageId = ctx.update.callback_query.message?.message_id;

    if (messageId) {
        ctx.deleteMessage(messageId);
    }

    if (user) {
        let compId = user.dataValues.comp_id;
        const currentPage = parseInt(ctx.match[1] || "0");

        await sendPageWithButton(ctx, currentPage + 1, compId);
    }
});

composer.action(/(^sold=[\s\S])[\w\W]+/g, async (ctx) => {
    let text: any;

    let messageId = ctx.update.callback_query.message?.message_id;

    if (ctx.update.callback_query && ctx.update.callback_query.message) {
        const message = ctx.update.callback_query.message;
        if ("text" in message) {
            text = message.text;
        }
    }
    const id = ctx.match[0].split("=")[1];
    const product = await Orders.findByPk(id);

    if (product?.dataValues.status !== "SOLD") {
        ctx.answerCbQuery("This product is already Ready");
    }

    if (product && "status" in product) {
        product.status = "SOLD_AND_CHECKED";
        product.save();

        ctx.editMessageText(text + "\n\n<b>✅Готовый</b>", {
            parse_mode: "HTML",
        });
    }

    setTimeout(() => {
        ctx.deleteMessage(messageId);
    }, 10000);
});

composer.action(/next_page=(\d+)/, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id;

    const user = await User.findOne({ where: { bot_id: telegramId } });
    let messageId = ctx.update.callback_query.message?.message_id;
    if (user) {
        let compId = user.dataValues.comp_id;
        const currentPage = parseInt(ctx.match[1] || "0");
        ctx.deleteMessage(messageId);
        await sendAcceptedOrders(ctx, currentPage + 1, compId);
    }
});

composer.action(/old_page=(\d+)/, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id;

    const user = await User.findOne({ where: { bot_id: telegramId } });
    let messageId = ctx.update.callback_query.message?.message_id;
    if (user) {
        let compId = user.dataValues.comp_id;
        const currentPage = parseInt(ctx.match[1] || "0");
        if (currentPage > 0) {
            ctx.deleteMessage(messageId);
            await sendAcceptedOrders(ctx, currentPage - 1, compId);
        } else {
            await ctx.answerCbQuery("Вы на первой странице!");
        }
    }
});

composer.action(/next_page_active=(\d+)/, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id;

    const user = await User.findOne({ where: { bot_id: telegramId } });
    let messageId = ctx.update.callback_query.message?.message_id;
    let compId = user?.dataValues.comp_id;

    if (user) {
        const currentPage = parseInt(ctx.match[1] || "0");
        const data = await sendActiveOrders(ctx, currentPage + 1, compId);
        let message = data?.message;
        let key3 = data?.key;
        let key1 = data?.keyboardArray;
        let key2 = data?.keyboardArray1;
        if (message && key1 && key2 && key3) {
            await ctx.editMessageText(message, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [[...key1], [...key2], [...key3]],
                },
            });
        }
    }
});

composer.action(/old_page_active=(\d+)/, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id;

    const user = await User.findOne({ where: { bot_id: telegramId } });
    let messageId = ctx.update.callback_query.message?.message_id;
    if (user) {
        let compId = user.dataValues.comp_id;
        const currentPage = parseInt(ctx.match[1] || "0");
        if (currentPage > 0) {
            const data = await sendActiveOrders(ctx, currentPage - 1, compId);
            let message = data?.message;
            let key3 = data?.key;
            let key1 = data?.keyboardArray;
            let key2 = data?.keyboardArray1;
            if (message && key1 && key2 && key3) {
                await ctx.editMessageText(message, {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [[...key1], [...key2], [...key3]],
                    },
                });
            }
        } else {
            await ctx.answerCbQuery("Вы на первой странице!");
        }
    }
});

composer.action(/next_page_reject=(\d+)/, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id;

    const user = await User.findOne({ where: { bot_id: telegramId } });
    let messageId = ctx.update.callback_query.message?.message_id;
    let compId = user?.dataValues.comp_id;

    if (user) {
        const currentPage = parseInt(ctx.match[1] || "0");
        const data = await sendRejectedOrders(ctx, currentPage + 1, compId);
        let message = data?.message;
        let key3 = data?.key;
        let key1 = data?.keyboardArray;
        let key2 = data?.keyboardArray1;
        if (message && key1 && key2 && key3) {
            await ctx.editMessageText(message, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [[...key1], [...key2], [...key3]],
                },
            });
        }
    }
});

composer.action(/old_page_reject=(\d+)/, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id;

    const user = await User.findOne({ where: { bot_id: telegramId } });
    let messageId = ctx.update.callback_query.message?.message_id;
    if (user) {
        let compId = user.dataValues.comp_id;
        const currentPage = parseInt(ctx.match[1] || "0");
        if (currentPage > 0) {
            const data = await sendRejectedOrders(ctx, currentPage - 1, compId);
            let message = data?.message;
            let key3 = data?.key;
            let key1 = data?.keyboardArray;
            let key2 = data?.keyboardArray1;
            if (message && key1 && key2 && key3) {
                await ctx.editMessageText(message, {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [[...key1], [...key2], [...key3]],
                    },
                });
            }
        } else {
            await ctx.answerCbQuery("Вы на первой странице!");
        }
    }
});

composer.action(/next_page_accept=(\d+)/, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id;

    const user = await User.findOne({ where: { bot_id: telegramId } });
    let messageId = ctx.update.callback_query.message?.message_id;
    let compId = user?.dataValues.comp_id;

    if (user) {
        const currentPage = parseInt(ctx.match[1] || "0");
        console.log(ctx.match);

        const data = await sendAcceptedOrders(ctx, currentPage + 1, compId);
        let message = data?.message;
        let key3 = data?.key;
        let key1 = data?.keyboardArray;
        let key2 = data?.keyboardArray1;
        if (message && key1 && key2 && key3) {
            await ctx.editMessageText(message, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [[...key1], [...key2], [...key3]],
                },
            });
        }
    }
});

composer.action(/old_page_accept=(\d+)/, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id;

    const user = await User.findOne({ where: { bot_id: telegramId } });
    let messageId = ctx.update.callback_query.message?.message_id;
    if (user) {
        let compId = user.dataValues.comp_id;
        const currentPage = parseInt(ctx.match[1] || "0");
        console.log(ctx.match);
        // const search_text = ctx.match
        if (currentPage > 0) {
            const data = await sendAcceptedOrders(ctx, currentPage - 1, compId);
            let message = data?.message;
            let key3 = data?.key;
            let key1 = data?.keyboardArray;
            let key2 = data?.keyboardArray1;
            if (message && key1 && key2 && key3) {
                await ctx.editMessageText(message, {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [[...key1], [...key2], [...key3]],
                    },
                });
            }
        } else {
            await ctx.answerCbQuery("Вы на первой странице!");
        }
    }
});

composer.action(/next_page_search=(\d+)/, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id;

    const user = await User.findOne({ where: { bot_id: telegramId } });
    let compId = user?.dataValues.comp_id;

    if (user) {
        const currentPage = parseInt(ctx.match[1] || "0");
        const text = ctx.match["input"].split("=")[2];
        const data = await searchOrders(ctx, currentPage + 1, compId, text);
        let message = data?.message;
        let key3 = data?.key;
        let key1 = data?.keyboardArray;
        let key2 = data?.keyboardArray1;
        if (message && key1 && key2 && key3) {
            await ctx.editMessageText(message, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [[...key1], [...key2], [...key3]],
                },
            });
        }
    }
});

composer.action(/old_page_search=(\d+)/, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id;

    const user = await User.findOne({ where: { bot_id: telegramId } });
    let messageId = ctx.update.callback_query.message?.message_id;
    if (user) {
        let compId = user.dataValues.comp_id;
        const currentPage = parseInt(ctx.match[1] || "0");
        const text = ctx.match["input"].split("=")[2];
        if (currentPage > 0) {
            const data = await searchOrders(ctx, currentPage - 1, compId, text);
            let message = data?.message;
            let key3 = data?.key;
            let key1 = data?.keyboardArray;
            let key2 = data?.keyboardArray1;
            if (message && key1 && key2 && key3) {
                await ctx.editMessageText(message, {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [[...key1], [...key2], [...key3]],
                    },
                });
            }
        } else {
            await ctx.answerCbQuery("Вы на первой странице!");
        }
    }
});

composer.action("delete_menu", async (ctx) => {
    try {
        let messageId = ctx.update.callback_query.message?.message_id;
        console.log(messageId);
        if (messageId) {
            ctx.deleteMessage(messageId);
        }
    } catch (error) {
        console.log(error);
    }
});

composer.action("delete_menu_search", async (ctx) => {
    try {
        let messageId = ctx.update.callback_query.message?.message_id;
        console.log(messageId);
        if (messageId) {
            ctx.deleteMessage(messageId - 1);
            ctx.deleteMessage(messageId);
        }
    } catch (error) {
        console.log(error);
    }
});

composer.action(/(^info=[\s\S])[\w\W]+/g, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id;

    const user = await User.findOne({ where: { bot_id: telegramId } });
    let id = ctx.match[0].split("=")[1];

    if (user) {
        await sendOrderInfo(ctx, id);
    }
});

composer.action("delete", async (ctx) => {
    let messageId = ctx.update.callback_query.message?.message_id;
    if (messageId) {
        ctx.deleteMessage(messageId);
    }
});

bot.use(composer.middleware());
