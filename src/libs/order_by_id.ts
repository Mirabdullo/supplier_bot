import { Context } from "telegraf";
import { Orders } from "../models/order.model";
import { Models } from "../models/model.model";
import { FurnitureType } from "../models/furniture_type.model";
import { Deals } from "../models/deals";
import { format } from "date-fns";
import { Client } from "../models/client.model";

export async function sendOrderInfo(ctx: Context, orderId: string) {
    try {
        const order = await Orders.findOne({
            where: { id: orderId },
            attributes: ["id", "order_id", "status", "tissue", "title", "qty"],
            include: [
                {
                    model: Deals,
                    attributes: ["delivery_date"],
                    include: [
                        {
                            model: Client,
                            attributes: ["name", "phone"],
                        },
                    ],
                },
                {
                    model: Models,
                    attributes: ["name", "code", "company_id"],
                    include: [
                        {
                            model: FurnitureType,
                            attributes: ["name"],
                        },
                    ],
                },
            ]
        });


        if (order) {
            let payload = {
                id: order.dataValues.id,
                orderId: order.dataValues.order_id,
                type: order.dataValues.model.furniture_type.name,
                model: order.dataValues.model.name,
                tissue: order.dataValues.tissue,
                qty: order.dataValues.qty,
                clientName: order.dataValues.deal?.client?.name,
                clientPhone: order.dataValues.deal?.client?.phone,
                delivery_date: order.dataValues.deal?.dataValues.delivery_date ? format(order.dataValues.deal?.dataValues.delivery_date, "d.MM.yyyy") : null,
                title: order.dataValues.title,
            };
            
            let status = order.dataValues?.status
            let stat = status === "ACCEPTED" ? "Принято" : status === "REJECTED" ? "Отменённый" : status === "ACTIVE" ? "Активный" : status

            let client = status === "ACCEPTED" ? `<b>Клиент</b>: ${payload.clientName}\n<b>Тел</b>: ${payload.clientPhone}\n`: ""
            let date = status === "ACCEPTED" && payload.delivery_date ? `<b>Дата доставки</b>: ${payload.delivery_date}\n`  : ""
            let message = `<b>Ид</b>: ${payload.orderId}\n<b>Вид мебели</b>: ${payload.type}\n<b>Модель</b>: ${payload.model}\n<b>Ткань</b>: ${payload.tissue}\n<b>Кол-во</b>: ${payload.qty}\n<b>Статус</b>: ${stat}\n${client}${date}<b>Примечание</b>: ${payload.title}`;
    
            await ctx.reply(message, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [[{ text: "Очистить", callback_data: "delete" }]],
                },
            });
        }
    } catch (error) {
        console.log(error);
    }
}
