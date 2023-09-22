import { Context, Telegraf } from "telegraf";
import { sequelize } from "./db"
import dotenv from "dotenv"
dotenv.config()

// const token: string = process.env.TOKEN || ""   // server token
const token: string = process.env.TEST_TOKEN || ""  //local token

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

start();

bot.launch()

