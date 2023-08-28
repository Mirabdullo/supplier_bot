import { Context, Markup } from "telegraf";
import { Orders } from "../models/order.model";
import { Model } from "../models/model.model";
import { FurnitureType } from "../models/furniture_type.model";
import { WareHouseProduct } from "../models/product.model";


export async function newProducts(ctx: Context, userId: string) {
    const products = await WareHouseProduct.findAll({
        where: {
            "$order.status$": "NEW",
            "$order.model.company_id$": userId,
            is_active: true
        },
        include: [
            {
                model: Orders,
                as: "order",
                attributes: ["id", "order_id", "status"],
                include: [
                    {
                        model: Model,
                        attributes: ["name", "code", "company_id"],
                        include: [
                            {
                                model: FurnitureType,
                                attributes: ["name"],
                            },
                        ],
                    },
                ],
            },
        ],
        order: [["createdAt", "ASC"]],
    });


    if (products && products.length > 0) {
        products.forEach(async (product,index) => {
            try {
                let id = product.dataValues?.order_id;
                let orderId = product.dataValues?.order?.order_id;
                let model = product.dataValues?.order?.model?.name;
                let type = product.dataValues?.order?.model?.furniture_type.name;
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
        });
    }
}

