import { Context, Markup } from "telegraf";
import { Orders } from "../models/order.model";
import { Models } from "../models/model.model";
import { FurnitureType } from "../models/furniture_type.model";
import { Model } from "sequelize";

export async function newProducts(ctx: Context, compId: string) {
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

    console.log(products.length);

    const batchSize = 25; // Batch size for sending products

    if (products && products.length > 0) {
        let batchIndex = 0;

        async function sendNextBatch() {
            const currentBatch = products.slice(batchIndex, batchIndex + batchSize);

            for (const product of currentBatch) {
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

            batchIndex += batchSize;

            if (batchIndex < products.length) {
                setTimeout(sendNextBatch, 60000); // Wait 1 minute before sending the next batch
            } else {
                console.log("All products sent.");
            }
        }

        sendNextBatch();
    } else {
        await ctx.reply("Новых заказов пока нет!", {
            parse_mode: "HTML",
        });
    }

    // if (products && products.length > 0) {
    //     products.forEach(async (product, index) => {
    //         try {
    //             let id = product.dataValues?.id;
    //             let orderId = product.dataValues?.order_id;
    //             let model = product.dataValues?.model?.name;
    //             let type = product.dataValues?.model?.furniture_type?.name;
    //             await ctx.reply(`\nОрдерИд : ${orderId}\nМебель: ${type}\nМодель: ${model}`, {
    //                 parse_mode: "HTML",
    //                 reply_markup: {
    //                     inline_keyboard: [
    //                         [
    //                             { text: "Отмена", callback_data: `reject=${id}` },
    //                             { text: "Принял", callback_data: `accept=${id}` },
    //                         ],
    //                     ],
    //                 },
    //             });
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     });
    // } else {
    //     await ctx.reply("Новых заказов пока нет!", {
    //         parse_mode: "HTML",
    //     });
    // }
}

let batchSize = 20;

export async function sendProductsPage(ctx: Context, pageNumber: number, compId: string) {
    try {
        const offset = pageNumber * batchSize;
        const products = await productsFromDatabase(offset, batchSize, compId);

        if (products.length > 0) {
            for (const product of products) {
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
            }

            // Create inline keyboard buttons for pagination
            const nextPageNumber = pageNumber + 1;
            const prevPageNumber = pageNumber - 1;
            const keyboard = [];
            if (prevPageNumber >= 0) {
                keyboard.push({ text: "Previous", callback_data: `view_page:${prevPageNumber}` });
            }
            if (products.length === batchSize) {
                keyboard.push({ text: "Next", callback_data: `view_page:${nextPageNumber}` });
            }

            await ctx.reply("Select a page:", {
                reply_markup: {
                    inline_keyboard: [keyboard],
                },
            });
        } else {
            await ctx.reply("No more products to show.");
        }
    } catch (error) {
        console.log(error);
    }
}

async function productsFromDatabase(offset: number, limit: number, compId: string) {
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

    console.log(products.length);

    return products.slice(offset, offset + limit);
}
