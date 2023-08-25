import { Context } from "telegraf";
import { Orders } from "../models/order.model";
import { Model } from "../models/model.model";
import { FurnitureType } from "../models/furniture_type.model";
import { WareHouseProduct } from "../models/product.model";


export async function newProducts(ctx: Context, userId: string){
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
                                attributes: ["name"]
                            }
                        ]
                    },

                ]
            }
        ],
        order: [["createdAt", "ASC"]],
        // offset: offset,
        // limit: 1
    })

    if (!products || products.length === 0) {
        await ctx.reply(`Tanlangan bo'limda boshqa faol e'lon yo'q`)
    } else {
        products.forEach(async (product) => {
            try {
                let txt = `Keyingi elonni ko'rish ➡️ `
                console.log(product);
                // const {} = product.dataValues
                // await ctx.reply(`Product info: \n\n ${product?.order?.order_id}`)
            } catch (error) {
                console.log(error);
            }
        })
    }
}