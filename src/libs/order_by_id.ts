import { Context } from "telegraf";
import { Orders } from "../models/order.model";
import { Models } from "../models/model.model";
import { FurnitureType } from "../models/furniture_type.model";
import { Deals } from "../models/deals";

export async function sendOrderInfo(ctx: Context, orderId: string) {
    try {
        console.log(orderId);
        const order = await Orders.findOne({
            where: { id: orderId },
            attributes: ["order_id", "tissue", "title", "qty", "status"],
            include: [
                {
                    model: Deals,
                    attributes: ["delivery_date"],
                },
                {
                    model: Models,
                    attributes: ["name"],
                    include: [
                        {
                            model: FurnitureType,
                            attributes: ["name"],
                        },
                    ],
                },
            ],
        });
        
        let options = { day: "numeric", month: "2-digit", year: "numeric" }
        let status = order?.dataValues?.status
        let stat = status === "ACCEPTED"? "Принято" : status === "REJECTED" ? "Отменённый" : status === "ACTIVE" ? "Активный" : status
        let message = `<b>Ид</b>: ${order?.dataValues?.order_id}\n<b>Вид мебели</b>: ${order?.dataValues.model?.furniture_type?.name}\n<b>Модель</b>: ${order?.dataValues
            ?.model?.name}\n<b>Ткань</b>: ${order?.dataValues?.tissue}\n<b>Кол-во</b>: ${order?.dataValues?.qty}\n<b>Статус</b>: ${stat}\n${
            order?.dataValues?.deal?.delivery_date ? "<b>Дата доставки</b>: " + order.dataValues?.deal?.delivery_date.toLocaleString('uz', options) + "\n" : ""
        }<b>Примечание</b>: ${order?.dataValues?.title}`;

        await ctx.reply(message, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [[{ text: "❌", callback_data: "delete" }]],
            },
        });
    } catch (error) {
        console.log(error);
    }
}
