import { Composer, Markup } from "telegraf";
import { User } from "../models/user.model";
import { bot } from "../core";
import { sendPageWithButton } from "../libs/products.service";
import { menu } from "../libs/keyboards";

const composer = new Composer();

composer.on("contact", async (ctx) => {
    const contact = ctx.message.contact;
    let num = "+" + contact.phone_number.trim().replace(" ", "");
    let telegramId = ctx.message.contact.user_id;
    console.log(contact, num);

    const user = await User.findOne({ where: { phone: num } });
    if (user) {
        if (["PRODUCER"].includes(user.dataValues?.role)) {
            let id = user.dataValues.comp_id;
            let bot_id = user.dataValues.bot_id;

            if (!user.dataValues.bot_id) {
                await User.update({ bot_id: ctx.from.id }, { where: { id: user.dataValues.id } });
                await ctx.reply(
                    `Номер принят. Для использования бота обратитесь к <a href="https://t.me/Fatkhull01">администратору</a> Woodline.\n\n<b>Мы рады работать с вами!🫡</b>`,
                    {
                        parse_mode: "HTML",
                    }
                );
            } else if (user.dataValues.use_bot && telegramId === parseInt(bot_id)) {
                await menu(ctx);
                await sendPageWithButton(ctx, 0, id);
            } else {
                await ctx.reply("Аккаунт Telegram недействителен для использования бота!", {
                    parse_mode: "HTML",
                });
            }
        } else {
            await ctx.reply("Аккаунт Telegram недействителен для использования бота!", {
                parse_mode: "HTML",
            });
        }
    } else {
        await ctx.reply(
            `Неправильный номер.\nВведите свой контактный номер которое привязан  к <b>Woodline</b>, как показано в образце!\n\Образец: +998951234567`,
            {
                parse_mode: "HTML",
                reply_markup: { remove_keyboard: true },
            }
        );
    }
});

bot.use(composer.middleware());
