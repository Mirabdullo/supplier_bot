import { Context, Markup } from "telegraf";

export async function menu(ctx: Context) {
    return await ctx.reply("Выберите нужный раздел", {
        parse_mode: "HTML",
        ...Markup.keyboard([["Принятые заказы", "Непринятые заказы"], ["Товары на складе"]])
            .oneTime()
            .resize(),
    });
}
