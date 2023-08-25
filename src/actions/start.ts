import { Composer, Markup } from "telegraf";
import { bot } from "../core";

const composer = new Composer();

composer.start(async (ctx) => {
    // console.log(ctx.from);
    await ctx.reply(`Assalomu alaykum!\nXush kelibsiz ${ctx.from.first_name}`, {
        parse_mode: "HTML",
    });
    await ctx.reply(`Iltimos, <b>"Telefon raqamni yuborish"</b> tugmasini bosing! `, {
        parse_mode: "HTML",
        ...Markup.keyboard([[Markup.button.contactRequest("📱 Telefon raqamni yuborish")]])
            .oneTime()
            .resize(),
    });

    
});

bot.use(composer.middleware());
