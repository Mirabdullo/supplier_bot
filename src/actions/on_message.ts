import { Composer, Context } from "telegraf";
import { bot } from "../core";
import { User } from "../models/user.model";
import { sendPageWithButton } from "../libs/products.service";
import { menu } from "../libs/keyboards";
import { searchOrders } from "../libs/search_orders";

const composer = new Composer();

composer.on("message", async (ctx) => {
    try {
        let telegramId = ctx.from.id;
        let text = "text" in ctx.message ?  ctx.message.text : ""

        if (text) {
            const checkUser = await User.findOne({ where: { bot_id: ctx.from.id, use_bot: true } });
            const user = await User.findOne({ where: { phone: text } });
            if (user) {
                let id = user.dataValues.comp_id;
                let role = user.dataValues.role;
                let bot_id = user.dataValues.bot_id;

                if (role !== "PRODUCER") {
                    await ctx.reply(`Извините, вы не можете использовать этого бота!`, {
                        parse_mode: "HTML",
                    });
                } else {
                    let use = user.dataValues.use_bot;
                    if (use && telegramId === parseInt(bot_id)) {
                        await menu(ctx);
                        await sendPageWithButton(ctx, 0, id);
                    } else {
                        await ctx.reply(
                            `Номер принят. Для использования бота обратитесь к <a href="https://t.me/Fatkhull01">администратору</a> Woodline.\n\n<b>Мы рады работать с вами!🫡</b>`,
                            {
                                parse_mode: "HTML",
                            }
                        );

                        if (!user.dataValues.bot_id) {
                            await User.update({ bot_id: ctx.from.id }, { where: { id: user.dataValues.id } });
                        }
                    }
                }
            } else {
                if (!checkUser) {
                    await ctx.reply(
                        `Неправильный номер.\nЕсли у вас возникли проблемы с регистрацией, обратитесь к <a href="https://t.me/Fatkhull01">администратору</a>.`,
                        {
                            parse_mode: "HTML",
                            disable_web_page_preview: true,
                        }
                    );
                } else {
                    let compId = checkUser.dataValues.comp_id;
                    const data = await searchOrders(ctx, 0, compId, text);
                    let message = data?.message;
                    let key3 = data?.key;
                    let key1 = data?.keyboardArray;
                    let key2 = data?.keyboardArray1;
                    if (message && key1 && key2 && key3) {
                        await ctx.reply(message, {
                            parse_mode: "HTML",
                            reply_markup: {
                                inline_keyboard: [[...key1], [...key2], [...key3]],
                            },
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
});

bot.use(composer.middleware());
