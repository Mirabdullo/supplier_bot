import { Context, Telegraf } from "telegraf";
import { sequelize } from "./db"


const token = "6491679680:AAFaZfYkSjdP3bY62VBzY57u8Uzt7exMTMY";   // server token
// const token = "6243689515:AAHok9fMY6ef83GHkCCUJvMyhHFL_JUSt2I"   //local token

export const bot = new Telegraf(token);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Connection has been astablished successfully");
    } catch (error) {
        console.log("\nUnable to connect to the database:\n\n", error);
    }
};


const MAX_MESSAGE_PER_SECOND = 30
let lastMessageTimeStamp = 0;
let messageCount = 0;

bot.use((ctx: Context, next) => {
    const now = Date.now();

    if (now - lastMessageTimeStamp > 1000) {
        lastMessageTimeStamp = now;
        messageCount = 0
    }

    if (messageCount >= MAX_MESSAGE_PER_SECOND) {
        ctx.reply('Rate limit exceeded. Please try again later.');
    } else {
      messageCount++;
      next();
    }
})

start();

bot.launch()

