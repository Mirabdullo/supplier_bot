import { Context, Markup } from "telegraf";
import { Orders } from "../models/order.model";
import { Models } from "../models/model.model";
import { FurnitureType } from "../models/furniture_type.model";

const PAGE_SIZE = 10;

export async function sendActiveOrders(ctx: Context, pageIndex: number, compId: string) {
    const products = await getPageProducts(compId);
    console.log(products.length);
    let pageProducts = products.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

    if (pageProducts.length > 0) {
        let message = `Результаты <b>активный</b>: ${PAGE_SIZE * pageIndex + 1}-${PAGE_SIZE * pageIndex + PAGE_SIZE} из ${products.length}\n\n`;
        let i = 0;
        let keyboardArray = [];
        let keyboardArray1 = [];
        for (let product of pageProducts) {
            try {
                i++;
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
            { text: "⬅️", callback_data: `old_page_active=${pageIndex}` },
            { text: "Очистить", callback_data: `delete_menu` },
            { text: "➡️", callback_data: `next_page_active=${pageIndex}` },
        ];

        return { message, keyboardArray, keyboardArray1, key };
    } else {
        ctx.reply("Новых заказов пока нет!", {
            parse_mode: "HTML",
        });
    }
}

async function getPageProducts(compId: string) {
    const products = await Orders.findAll({
        where: {
            status: "ACTIVE",
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
