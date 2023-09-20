import { Context, Markup } from "telegraf";
import { Orders } from "../models/order.model";
import { Models } from "../models/model.model";
import { FurnitureType } from "../models/furniture_type.model";
import { Deals } from "../models/deals";
import { Client } from "../models/client.model";
import { format } from "date-fns";

const PAGE_SIZE = 15;

export async function sendPageWithButton(ctx: Context, pageIndex: number, compId: string) {
    const products = await getPageProducts(pageIndex, compId);
    let pageProducts = products.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

    if (pageProducts.length > 0) {
        const keyboard = constructInlineKeyboard(pageIndex, products.length);

        for (let product of pageProducts) {
            try {
                let payload = {
                    id: product.dataValues.id,
                    orderId: product.dataValues.order_id,
                    type: product.dataValues.model.furniture_type.name,
                    model: product.dataValues.model.name,
                    tissue: product.dataValues.tissue,
                    qty: product.dataValues.qty,
                    clientName: product.dataValues.deal.client.name,
                    clientPhone: product.dataValues.deal.client.phone,
                    delivery_date: format(product.dataValues.deal.dataValues.delivery_date, "d.MM.yyyy"),
                    title: product.dataValues.title,
                };
                let message = `<b>Новый заказ</b>\n\n<b>Ид</b>: ${payload.orderId}\n<b>Вид мебели</b>: ${payload.type}\n<b>Модель</b>: ${payload.model}\n<b>Ткань</b>: ${payload.tissue}\n<b>Кол-во</b>: ${payload.qty}\n<b>Клиент</b>: ${payload.clientName}\n<b>Тел</b>: ${payload.clientPhone}\n<b>Дата доставки</b>: ${payload.delivery_date}\n<b>Примечание</b>: ${payload.title}`;


                await ctx.reply(message, {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "Отмена", callback_data: `reject=${payload.id}` },
                                { text: "Принял", callback_data: `accept=${payload.id}` },
                            ],
                        ],
                    },
                });
            } catch (error) {
                console.log(error);
            }
        }

        if (products.length - PAGE_SIZE * pageIndex > PAGE_SIZE) {
            await ctx.reply("Посмотреть больше продуктов", {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: keyboard,
                },
            });
        } else {
            await ctx.reply("Больше не осталось!");
        }
    } else {
        ctx.reply("Новых заказов пока нет!", {
            parse_mode: "HTML",
        });
    }
}

async function getPageProducts(pageIndex: number, compId: string) {
    const products = await Orders.findAll({
        where: {
            status: "NEW",
            "$model.company_id$": compId,
            is_active: true,
        },
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
        ],
        order: [["createdAt", "ASC"]],
    });

    return products;
}

function constructInlineKeyboard(pageIndex: number, productsCount: number) {
    if (productsCount > PAGE_SIZE * (pageIndex + 1)) {
        return [[{ text: "Следующий", callback_data: `next_page=${pageIndex}` }]];
    } else {
        return [];
    }
}
