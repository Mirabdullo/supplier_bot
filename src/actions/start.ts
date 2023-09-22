import { Composer, Markup } from "telegraf";
import { bot } from "../core";

const composer = new Composer();

composer.start(async (ctx) => {
    console.log(ctx.from);
    await ctx.reply(`Здраствыйте!`, {
        parse_mode: "HTML",
    });
    await ctx.reply(`Пожалуйста, нажмите кнопку <b>"Отправить номер телефона"</b>, чтобы зарегистрироваться от бота!`, {
        parse_mode: "HTML",
        ...Markup.keyboard([[Markup.button.contactRequest("📱 Отправить номер телефона")]])
            .oneTime()
            .resize(),
    });

    
});



bot.use(composer.middleware());
