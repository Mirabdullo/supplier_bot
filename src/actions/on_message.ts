import { Composer, Context } from "telegraf";
import { bot } from "../core";
import { User } from "../models/user.model";
import { newProducts } from "../libs/products.service";

const composer = new Composer();

composer.on("message", async (ctx) => {
    try {
        let telegramId = ctx.from.id
        if ("text" in ctx.update.message) {
            console.log(ctx.update.message.text);
            const user = await User.findOne({ where: { phone: ctx.update.message.text } });
            if (user) {
                console.log(user.dataValues);
                let id = user.dataValues.comp_id;
                let role = user.dataValues.role
                let bot_id = user.dataValues.bot_id

                if (role !== "PRODUCER") {
                    await ctx.reply(`Извините, вы не можете использовать этого бота!`, {
                        parse_mode: "HTML"
                    })
                }
                else {
                    let use = user.dataValues.use_bot
                        if (use && telegramId === parseInt(bot_id)) {
                            await newProducts(ctx, id);
                        } else {
                            await ctx.reply(
                                "Номер принят. Для использования бота обратитесь к администратору Woodline.\n\nПриносим извинения за неудобства!",
                                {
                                    parse_mode: "HTML",
                                }
                            );
    
                            if (!user.dataValues.bot_id) {
                                await User.update({ bot_id: ctx.from.id }, { where: { id: user.dataValues.id } });
                            }
                        }
                }
            }

            else {
                console.log("user null");
                await ctx.reply(
                    `Неправильный номер.\nЕсли у вас возникли проблемы с регистрацией, обратитесь к <a href="https://t.me/Fatkhull01">администратору</a>.`,
                    {
                        parse_mode: "HTML",
                        disable_web_page_preview: true,
                    }
                );
            }
        }
    } catch (error) {
        console.log(error);
    }
});

bot.use(composer.middleware());
