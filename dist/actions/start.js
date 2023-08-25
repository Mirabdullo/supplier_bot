"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const core_1 = require("../core");
const composer = new telegraf_1.Composer();
composer.start(async (ctx) => {
    console.log(ctx);
});
core_1.bot.use(composer.middleware());
//# sourceMappingURL=start.js.map