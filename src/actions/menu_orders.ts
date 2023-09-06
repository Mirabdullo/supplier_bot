import { Composer } from "telegraf";
import { bot } from "../core";
import { sendAcceptedOrders } from "../libs/accepted_order";
import { User } from "../models/user.model";
import { sendRejectedOrders } from "../libs/rejected_orders";
import { sendActiveOrders } from "../libs/active_orders";

const composer = new Composer();

composer.hears("Принятые заказы", async (ctx) => {
    const id = ctx.message.message_id;
    const user_id = ctx.from.id;
    const user = await User.findOne({ where: { bot_id: user_id } });

    if (user) {
        const data = await sendAcceptedOrders(ctx, 0, user?.dataValues?.comp_id);
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
    }
});

composer.hears("Непринятые заказы", async (ctx) => {
    const id = ctx.message.message_id;
    const user_id = ctx.from.id;
    const user = await User.findOne({ where: { bot_id: user_id } });

    if (user) {
        const data = await sendRejectedOrders(ctx, 0, user?.dataValues?.comp_id);
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
    }
});

composer.hears("Товары на складе", async (ctx) => {
    const id = ctx.message.message_id;
    const user_id = ctx.from.id;
    const user = await User.findOne({ where: { bot_id: user_id } });

    if (user) {
        const data = await sendActiveOrders(ctx, 0, user?.dataValues?.comp_id);
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
    }
});

bot.use(composer.middleware());
