import { Composer, Context, Telegraf } from "telegraf";
import { Orders } from "../models/order.model";
import { bot } from "../core";
import { InlineQueryResultArticle } from "typegram";
import { User } from "../models/user.model";
import { newProducts } from "../libs/products.service";

const composer = new Composer();

composer.action(/(^accept=[\s\S])[\w\W]+/g, async (ctx) => {
    let text: any;
    if (ctx.update.callback_query && ctx.update.callback_query.message) {
        const message = ctx.update.callback_query.message;
        if ("text" in message) {
            text = message.text;
        }
    }
    const id = ctx.match[0].split("=")[1];

    const product = await Orders.findByPk(id)
    console.log(product?.dataValues);

    await ctx.editMessageText(text + "\n\n<b>✅Принял</b>", {
        parse_mode: "HTML",
    });
});

composer.action(/(^reject=[\s\S])[\w\W]+/g, async (ctx) => {
    let text: any;
    if (ctx.update.callback_query && ctx.update.callback_query.message) {
        const message = ctx.update.callback_query.message;
        if ("text" in message) {
            text = message.text;
        }
    }
    const id = ctx.match[0].split("=")[1];
    console.log(id);
    const product = await Orders.findByPk(id);
    console.log(product?.dataValues);

    await ctx.editMessageText(text + "\n\n<b>🚫Отменено</b>", {
        parse_mode: "HTML",
    });
});


composer.action("start", async (ctx) => { 
    console.log(ctx.from);
    let id = ctx.from?.id
    const user = await User.findOne({ where: { bot_id: id } })

    if (user) {
        await newProducts(ctx, user.dataValues.comp_id)
    }
})





bot.use(composer.middleware());
