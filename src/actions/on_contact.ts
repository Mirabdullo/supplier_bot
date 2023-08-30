import { Composer, Markup } from "telegraf";
import { User } from "../models/user.model";
import { bot } from "../core";
import { sendPageWithButton } from "../libs/products.service";

const composer = new Composer();

composer.on("contact", async (ctx) => {
    const contact = ctx.message.contact;
    let num = "+" + contact.phone_number.trim().replace(" ", "");
    let telegramId = ctx.message.contact.user_id;
    console.log(contact, num);

    const user = await User.findOne({ where: { phone: num } });
    if (!user) {
        await ctx.reply(
            `Неправильный номер.\nВведите свой контактный номер которое привязан  к <b>Woodline</b>, как показано в образце!\n\Образец: +998951234567`,
            {
                parse_mode: "HTML",
                reply_markup: { remove_keyboard: true },
            }
        );
    } else {
        let role = user?.dataValues?.role;
        let use = user?.dataValues?.use_bot;
        let bot_id = user?.dataValues?.bot_id;

        if (role !== "PRODUCER") {
            await ctx.reply(`Извините, вы не можете использовать этого бота!`, {
                parse_mode: "HTML",
            });
        } else {
            if (use && bot_id === telegramId) {
                let compId = user.dataValues.comp_id;
                await sendPageWithButton(ctx, 0, compId);
            } else if (use && bot_id !== telegramId) {
                await ctx.reply("Неверный аккаунт Telegram!", {
                    parse_mode: "HTML",
                });
            } else {
                await ctx.reply(
                    `Номер принят. Для использования бота обратитесь к <a href="https://t.me/Fatkhull01">администратору</a> Woodline.\n\nМы рады работать с вами!`,
                    {
                        parse_mode: "HTML",
                    }
                );

                if (!user.dataValues.bot_id) {
                    await User.update({ bot_id: ctx.from.id }, { where: { id: user.dataValues.id } });
                }
            }
        }

        // let id = user.dataValues.comp_id;
        // await newProducts(ctx, id);
    }
});

bot.use(composer.middleware());
