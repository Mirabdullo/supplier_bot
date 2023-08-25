"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const user_model_1 = require("../models/user.model");
const composer = new telegraf_1.Composer();
composer.on('contact', async (ctx) => {
    const contact = ctx.message.contact.phone_number;
    console.log(contact);
    const user = await user_model_1.User.findOne({ where: { phone: contact } });
});
//# sourceMappingURL=on_contact.js.map