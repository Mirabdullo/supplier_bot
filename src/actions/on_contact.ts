import { Composer, Markup } from "telegraf";
import { User } from "../models/user.model";
import { bot } from "../core";
import { newProducts } from "../libs/products.service";

const composer = new Composer()

composer.on('contact', async (ctx) => {
    const contact = ctx.message.contact

    const user = await User.findOne({ where: { phone: contact.phone_number } })
    if (!user) {
        await ctx.reply(`Iltimos <b>Woodline</b> bilan bog'langan raqamingizni namunada ko'rsatilganidek kiriting!\n\nNamuna: +998951234567`, {
            parse_mode: "HTML",
            reply_markup: { remove_keyboard: true }
        });
        
    } else {
        let id = user.dataValues.comp_id
        await newProducts(ctx, id)
    } 

})


bot.use(composer.middleware())