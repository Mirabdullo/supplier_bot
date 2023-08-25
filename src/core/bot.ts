import { Telegraf } from "telegraf";
import { Sequelize } from "sequelize-typescript";
import { sequelize } from "./db";

const token = "6491679680:AAFaZfYkSjdP3bY62VBzY57u8Uzt7exMTMY";

export const bot = new Telegraf(token);

const start = async () => {
    try {
        // await sequelize.authenticate();
        await sequelize.authenticate().then(
            function (err) {
                console.log("Connection has been established successfully.");
            },
            function (err) {
                console.log("Unable to connect to the database:", err);
            }
        );
        await sequelize.sync();
        console.log("Connection has been astablished successfully");
    } catch (error) {
        console.log("\nUnable to connect to the database:\n\n", error);
    }
};

start();

bot.launch();
