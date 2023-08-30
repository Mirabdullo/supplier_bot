import { Context, Markup } from "telegraf";
import { Orders } from "../models/order.model";
import { Models } from "../models/model.model";
import { FurnitureType } from "../models/furniture_type.model";




const PAGE_SIZE = 15

export async function sendPageWithButton(ctx: Context, pageIndex: number, compId: string) {
    const products = await getPageProducts(pageIndex, compId);
    let pageProducts = products.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

        if (pageProducts.length > 0) {
            const keyboard = constructInlineKeyboard(pageIndex, products.length);
            console.log(keyboard);
            for (let product of pageProducts) { 
                try {
                    let id = product.dataValues?.id;
                    let orderId = product.dataValues?.order_id;
                    let model = product.dataValues?.model?.name;
                    let type = product.dataValues?.model?.furniture_type?.name;
                    await ctx.reply(`\nОрдерИд : ${orderId}\nМебель: ${type}\nМодель: ${model}`, {
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
            await ctx.reply("Посмотреть больше продуктов", {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: keyboard,
                },
            });
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
        attributes: ["id", "order_id", "status"],
        include: [
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

     return products
}

function constructInlineKeyboard(pageIndex: number, productsCount: number) {
    if (productsCount > PAGE_SIZE * (pageIndex + 1)) {
        return [[{ text: "Следующий", callback_data: `next_page=${pageIndex}` }]];
    } else {
        return [];
    }
}



