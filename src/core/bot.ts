import { Telegraf } from "telegraf";
import { Sequelize } from "sequelize-typescript";
import { sequelize } from "./db";
import cron from "node-cron"
import { User } from "../models/user.model";
import { newProducts } from "../libs/products.service";

// const token = "6491679680:AAFaZfYkSjdP3bY62VBzY57u8Uzt7exMTMY";   // server token
const token = "6243689515:AAHok9fMY6ef83GHkCCUJvMyhHFL_JUSt2I"   //local token

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

