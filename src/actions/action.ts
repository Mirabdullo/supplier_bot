import { Composer, Context, Telegraf } from "telegraf";
import { Orders } from "../models/order.model";
import { bot } from "../core";
import { InlineQueryResultArticle } from "typegram";
import { User } from "../models/user.model";
import { newProducts, sendProductsPage } from "../libs/products.service";
import { WareHouseProduct } from "../models/product.model";
import { createWarehouseProduct } from "../libs/warehouse.service";

const composer = new Composer();

composer.action(/(^accept=[\s\S])[\w\W]+/g, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id
    let text: any;
    if (ctx.update.callback_query && ctx.update.callback_query.message) {
        const message = ctx.update.callback_query.message;
        if ("text" in message) {
            text = message.text;
        }
    }
    const id = ctx.match[0].split("=")[1];
    
    const product = await Orders.findByPk(id)
    
    
    if (product?.dataValues.status === "ACCEPTED") {
        await ctx.answerCbQuery("Заказ принят через сайт!")
    }
    
    if (product?.dataValues.status === "REJECTED") {
        await ctx.answerCbQuery("Заказ отменен через сайт!")
    }
    
    const ifexists=  await createWarehouseProduct(ctx, product?.dataValues?.id, telegramId)
    
    if (!ifexists) {
        return;
    }
    
    console.log("accept: ", product?.dataValues?.id);
    if (product && "status" in product) {
        product.status = "ACCEPTED"
        await product.save()
    }


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
    const product = await Orders.findByPk(id);
    console.log("reject: ", product?.dataValues?.id);
    if (product?.dataValues.status === "ACCEPTED") {
        await ctx.answerCbQuery("Заказ принят через сайт!")
    }

    if (product?.dataValues.status === "REJECTED") {
        await ctx.answerCbQuery("Заказ отменен через сайт!")
    }

    if (product && "status" in product) {
        product.status = "REJECTED"
        await product.save()
    }

    await ctx.editMessageText(text + "\n\n<b>🚫Отменено</b>", {
        parse_mode: "HTML",
    });
});


composer.action("start", async (ctx) => { 
    let id = ctx.from?.id
    const user = await User.findOne({ where: { bot_id: id } })
    console.log(ctx.update.callback_query.message);
    let messageId = ctx.update.callback_query.message?.message_id

    if (messageId) {
        ctx.deleteMessage(messageId)
    }

    if (user) {
        await newProducts(ctx, user.dataValues.comp_id)
    }
})


composer.action(/view_page:(\d+)/, async (ctx) => {
try {
    let telegramId = ctx.update.callback_query.from.id

    const user = await User.findOne({ where: { bot_id: telegramId } })
    
    const pageNumber = parseInt(ctx.match[1]);
    if (user) {
        let id = user.dataValues.id
        let bot_id = user.dataValues.bot_id
        let use = user?.dataValues.use_bot
        let compId = user.dataValues.comp_id
        sendProductsPage(ctx, pageNumber, compId);
    }

} catch (error) {
    console.log(error);
}
});





bot.use(composer.middleware());
