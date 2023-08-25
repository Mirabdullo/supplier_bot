import { Composer } from "telegraf";
import { User } from "../models/user.model";
import { bot } from "../core";

const composer = new Composer()

composer.on('contact', async (ctx) => {
    const contact = ctx.message.contact
    console.log(contact);

    const user = await User.findOne({ where: { phone: contact.phone_number } })
    if (!user) {
        await ctx.reply(`Iltimos <b>Woodline</b> bilan bog'langan raqamingizni kiriting`, {
            parse_mode: "HTML",
        });
    }
})


bot.use(composer.middleware())