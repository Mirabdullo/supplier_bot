import { Context, Markup } from "telegraf";
import { Orders } from "../models/order.model";
import { Models } from "../models/model.model";
import { FurnitureType } from "../models/furniture_type.model";

const PAGE_SIZE = 10;

export async function sendAcceptedOrders(ctx: Context, pageIndex: number, compId: string) {
    try {
        const products = await getPageProducts(compId);
        if (products) {
            let pageProducts = products.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);
    
            if (pageProducts.length > 0) {
                let message = `Результаты <b>принял</b>: ${PAGE_SIZE * pageIndex + 1}-${PAGE_SIZE * pageIndex + PAGE_SIZE} из ${products.length}\n\n`;
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

                let key = []
                if (pageIndex === 0 && products.length <= PAGE_SIZE) {
                    key = [{ text: "Очистить", callback_data: `delete_menu` }];
                } else if (pageIndex == 0) {
                    key = [
                        { text: "Очистить", callback_data: `delete_menu` },
                        { text: "➡️", callback_data: `next_page_accept=${pageIndex}` },
                    ];
                } else if (products.length - ((pageIndex) * PAGE_SIZE) <= PAGE_SIZE) {
                    key = [
                        { text: "⬅️", callback_data: `old_page_accept=${pageIndex}` },
                        { text: "Очистить", callback_data: `delete_menu` },
                    ];
                } else {
                    key = [
                        { text: "⬅️", callback_data: `old_page_accept=${pageIndex}` },
                        { text: "Очистить", callback_data: `delete_menu` },
                        { text: "➡️", callback_data: `next_page_accept=${pageIndex}` },
                    ];
                }
        
                return { message, key, keyboardArray, keyboardArray1 };
            } else {
                ctx.reply("Новых заказов пока нет!", {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [[{ text: "Очистить", callback_data: "delete" }]],
                    },
                });
            }
        } 
    } catch (error) {
        console.log(error);
    }
}

async function getPageProducts(compId: string) {
    try {
        const products = await Orders.findAll({
            where: {
                status: "ACCEPTED",
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
    } catch (error) {
        console.log(error);
    }
}
