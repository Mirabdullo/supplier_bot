"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const telegraf_1 = require("telegraf");
const db_1 = require("./db");
const token = "6491679680:AAFaZfYkSjdP3bY62VBzY57u8Uzt7exMTMY";
exports.bot = new telegraf_1.Telegraf(token);
const start = async () => {
    try {
        await db_1.sequelize.authenticate();
        await db_1.sequelize.sync();
        console.log("Connection has been astablished successfully");
    }
    catch (error) {
        console.log("\nUnable to connect to the database:\n\n", error);
    }
};
start();
exports.bot.launch();
//# sourceMappingURL=bot.js.map