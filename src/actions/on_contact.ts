import { Composer, Markup } from "telegraf";
import { User } from "../models/user.model";
import { bot } from "../core";
import { newProducts } from "../libs/products.service";

const composer = new Composer()

composer.on('contact', async (ctx) => {
    const contact = ctx.message.contact
    let num = contact.phone_number.trim().replace(" ", "")

    const user = await User.findOne({ where: { phone: num } })
    if (!user) {
        await ctx.reply(`Неправильный номер.\nВведите свой контактный номер которое привязан  к <b>Woodline</b>, как показано в образце!\n\Образец: +998951234567`, {
            parse_mode: "HTML",
            reply_markup: { remove_keyboard: true }
        });
        
    }
    else if (user && "role" in user) {
        if (user.role !== "PRODUCER") {
            await ctx.reply(`Извините, вы не можете использовать этого бота!`, {
                parse_mode: "HTML"
            })
        }

    } else {
        if ("use_bot" in user) { 
            if(user.use_bot){
                await newProducts(ctx, user.dataValues.comp_id)
            } else {
                await ctx.reply(`Номер принят. Для использования бота обратитесь к <a href="https://t.me/Fatkhull01">администратору</a> Woodline.\n\nМы рады работать с вами!`, {
                    parse_mode: "HTML"
                })
            }
        }
        let id = user.dataValues.comp_id
        await newProducts(ctx, id)
    } 

})


bot.use(composer.middleware())