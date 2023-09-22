import { Composer } from "telegraf";
import { bot } from "../core";
import { sendAcceptedOrders } from "../libs/accepted_order";
import { User } from "../models/user.model";
import { sendRejectedOrders } from "../libs/rejected_orders";
import { sendActiveOrders } from "../libs/active_orders";

const composer = new Composer();

composer.hears("Принятые заказы", async (ctx) => {
    try {
        const accessUser = await User.findOne({ where: { bot_id: ctx.from?.id, use_bot: true } });
        if (accessUser) {
            const id = ctx.message.message_id;
                const data = await sendAcceptedOrders(ctx, 0, accessUser.dataValues.comp_id);
                let message = data?.message;
                let key3 = data?.key;
                let key1 = data?.keyboardArray;
                let key2 = data?.keyboardArray1;
                if (message && key1 && key2 && key3) {
                    await ctx.reply(message, {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [[...key1], [...key2], [...key3]],
                        },
                    });
                }
                setTimeout(() => {
                    console.log(id);
                    ctx.deleteMessage(id);
                }, 3000);
        } else {
            await ctx.answerCbQuery("Вы не можете использовать этого бота!", {show_alert: true} );
        }
    } catch (error) {
        console.log(error);
    }
});

composer.hears("Непринятые заказы", async (ctx) => {
    try {
        const accessUser = await User.findOne({ where: { bot_id: ctx.from?.id, use_bot: true } });
        if (accessUser) {
            const id = ctx.message.message_id;
                const data = await sendRejectedOrders(ctx, 0, accessUser.dataValues?.comp_id);
                let message = data?.message;
                let key3 = data?.key;
                let key1 = data?.keyboardArray;
                let key2 = data?.keyboardArray1;
                if (message && key1 && key2 && key3) {
                    await ctx.reply(message, {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [[...key1], [...key2], [...key3]],
                        },
                    });
                }
                setTimeout(() => {
                    console.log(id);
                    ctx.deleteMessage(id);
                }, 3000);
        } else {
            await ctx.answerCbQuery("Вы не можете использовать этого бота!", {show_alert: true} );
        }
    } catch (error) {
        console.log(error);
    }
});

composer.hears("Товары на складе", async (ctx) => {
    try {
        const accessUser = await User.findOne({ where: { bot_id: ctx.from?.id, use_bot: true } });
        if (accessUser) {
            const id = ctx.message.message_id;
                const data = await sendActiveOrders(ctx, 0, accessUser.dataValues?.comp_id);
                let message = data?.message;
                let key3 = data?.key;
                let key1 = data?.keyboardArray;
                let key2 = data?.keyboardArray1;
                if (message && key1 && key2 && key3) {
                    await ctx.reply(message, {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [[...key1], [...key2], [...key3]],
                        },
                    });
                }
                setTimeout(() => {
                    console.log(id);
                    ctx.deleteMessage(id);
                }, 3000);
        } else {
            await ctx.answerCbQuery("Вы не можете использовать этого бота!", {show_alert: true} );
        }
    } catch (error) {
        console.log("Error active orders: ",error);
    }
});

bot.use(composer.middleware());
