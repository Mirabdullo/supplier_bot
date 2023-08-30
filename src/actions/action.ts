import { Composer } from "telegraf";
import { Orders } from "../models/order.model";
import { bot } from "../core";
import { User } from "../models/user.model";
import { sendPageWithButton } from "../libs/products.service";
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
        let compId = user.dataValues.comp_id
        const currentPage = parseInt(ctx.match[1] || "0");

        await sendPageWithButton(ctx, currentPage + 1 ,compId);

    }
})





composer.action(/next_page=(\d+)/, async (ctx) => {
    let telegramId = ctx.update.callback_query.from.id

    const user = await User.findOne({ where: { bot_id: telegramId } })
    let messageId = ctx.update.callback_query.message?.message_id
    if (user) {
        let compId = user.dataValues.comp_id
        const currentPage = parseInt(ctx.match[1] || "0");
        ctx.deleteMessage(messageId)
        await sendPageWithButton(ctx, currentPage + 1 ,compId);

    }
});





bot.use(composer.middleware());
