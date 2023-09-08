import { Context, Markup } from "telegraf";
import { Orders } from "../models/order.model";
import { Models } from "../models/model.model";
import { FurnitureType } from "../models/furniture_type.model";
import { Deals } from "../models/deals";

const PAGE_SIZE = 15;

export async function sendPageWithButton(ctx: Context, pageIndex: number, compId: string) {
    const products = await getPageProducts(pageIndex, compId);
    let pageProducts = products.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

    if (pageProducts.length > 0) {
        const keyboard = constructInlineKeyboard(pageIndex, products.length);

        for (let product of pageProducts) {
            try {
                let id = product.dataValues?.id;
                let orderId = product.dataValues?.order_id;
                let model = product.dataValues?.model?.name;
                let type = product.dataValues?.model?.furniture_type?.name;
                let date = product.dataValues?.deal.delivery_date;

                let options = { day: "numeric", month: "2-digit", year: "numeric" };

                let message = `<b>Новый заказ</b>\n\n<b>Ид</b>: ${
                    product.dataValues.order_id
                }\n<b>Вид мебели</b>: ${type}\n<b>Модель</b>: ${model}\n<b>Ткань</b>: ${product.dataValues.tissue}\n<b>Кол-во</b>: ${
                    product.dataValues.qty
                }\n${date ? "<b>Дата доставки</b>: " + date.toLocaleString("uz", options) + "\n" : ""}<b>Примечание</b>: ${product.dataValues.title}`;
                await ctx.reply(message, {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "Отмена", callback_data: `reject=${id}` },
                                { text: "Принял", callback_data: `accept=${id}` },
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
