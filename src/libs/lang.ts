import { Context, Markup } from "telegraf";

export async function selectLang(ctx: Context) {
    return await ctx.reply(`<b>Tilni tanlang / Выберите язык:</b>`, {
      parse_mode: 'HTML',
      ...Markup.keyboard([["🇺🇿 O'zbek tili", '🇷🇺 Русский язык']])
        .oneTime()
        .resize(),
    })
  }