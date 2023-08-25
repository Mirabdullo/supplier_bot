import { Composer } from "telegraf";
import { bot } from "../core";
import { User } from "../models/user.model";
import { newProducts } from "../libs/products.service";

const composer = new Composer()

composer.on('message', async (ctx) => {
    if ('text' in ctx.update.message) {    
        console.log(ctx.update.message.text);
        const user = await User.findOne({ where: { phone: ctx.update.message.text } })
        
        if (user) {
            console.log(user.dataValues.id);
            let id = user.dataValues.id
            await newProducts(ctx, id)
        } else {
            await ctx.reply(`Iye brat bizi bazada yo'q ekansizu🤨`, {
                parse_mode: "HTML",
            });
        }
    }
    
})

bot.use(composer.middleware())