import { Context, Markup } from "telegraf";
import { Orders } from "../models/order.model";
import { Models } from "../models/model.model";
import { FurnitureType } from "../models/furniture_type.model";
import { Op } from "sequelize";

const PAGE_SIZE = 10;

export async function searchOrders(ctx: Context, pageIndex: number, compId: string, text: string) {
    console.log(text,"kkk");
    const products = await getPageProducts(compId, text);
    if (!products.length) {
        await ctx.reply("Заказ по запросу не найдена", {
            parse_mode: "HTML",
        });
    }
    console.log(products.length);
    let pageProducts = products.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

    if (pageProducts.length > 0) {
        let message = `Результаты <b>принял</b>: ${PAGE_SIZE * pageIndex + 1}-${PAGE_SIZE * pageIndex + PAGE_SIZE} из ${products.length}\n\n`;
        let i = 0;
        let keyboardArray = [];
        let keyboardArray1 = [];
        for (let product of pageProducts) {
            try {
                i++
                let id = product.dataValues?.id;
                let orderId = product.dataValues?.order_id;
                let model = product.dataValues?.model?.name;
                let type = product.dataValues?.model?.furniture_type?.name;

                message += `\n${i}. ${orderId} ${type} ${model}\n`;
                if (i >= 6) {
                    keyboardArray1.push({ text: `${i}`, callback_data: `info=${id}` });
                } else {

                    keyboardArray.push({ text: `${i}`, callback_data: `info=${id}` });
                }
            } catch (error) {
                console.log(error);
            }
        }
        console.log(pageIndex);
        let key = [
            { text: "⬅️" , callback_data: `old_page_search=${pageIndex}=${text}`},
            { text: "❌" , callback_data: `delete_menu_search`},
            { text: "➡️" , callback_data: `next_page_search=${pageIndex}=${text}`},
        ]
        
        return {message, key, keyboardArray, keyboardArray1}

    } else {
        await ctx.answerCbQuery("Больше не осталось!")
    }
}

async function getPageProducts(compId: string, text: string) {
    
    const products = await Orders.findAll({
        where: {
            [Op.or]: [{ order_id: { [Op.iLike]: `%${text}%` } }, { "$model.name$": { [Op.iLike]: `%${text}%` } }],
            status: { [Op.in]: ["ACCEPTED", "REJECTED", "ACTIVE"] },
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

    return products;
}


