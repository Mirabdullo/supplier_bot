import { Context } from "telegraf";
import { WareHouseProduct } from "../models/product.model";
import { User } from "../models/user.model";
import { Warehouse } from "../models/warehouse.model";



export async function createWarehouseProduct(ctx: Context, orderId: string, id: number) {
    try {
        const user = await User.findOne({ where: { bot_id: id } })
        let comp_id = user?.dataValues?.comp_id
        const warehouse = await Warehouse.findOne({ where: { company_id: comp_id } })
        if (!warehouse) {
            ctx.answerCbQuery("К сожалению, ваш склад не добавлен в наш список. Пожалуйста, свяжитесь с администрацией Woodline!")
            return null;
        }
        const newProduct = await WareHouseProduct.create({
            order_id: orderId,
            warehouse_id: warehouse?.dataValues?.id
        })

        console.log("prod: ", newProduct.dataValues.id);

        return newProduct;
    } catch (error) {
        console.log(error);
    }
}