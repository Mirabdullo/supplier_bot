import { Context } from "telegraf";
import { WareHouseProduct } from "../models/product.model";
import { User } from "../models/user.model";
import { Warehouse } from "../models/warehouse.model";
import { Company } from "../models/company.model";

export async function createWarehouseProduct(ctx: Context, orderId: string, id: number) {
    try {
        const user = await User.findOne({ where: { bot_id: id } });
        let comp_id = user?.dataValues?.comp_id;
        let warehouse = await Warehouse.findOne({ where: { company_id: comp_id } });
        if (!warehouse) {
            if (!warehouse) {
                const company = await Company.findOne({ where: { id: user?.dataValues.comp_id } });
                if (!company) {
                    ctx.answerCbQuery("К сожалению, ваш склад не добавлен в наш список. Пожалуйста, свяжитесь с администрацией Woodline!");
                    return null;
                }
                console.log("create warehouse");
                warehouse = await Warehouse.create({
                    name: company?.dataValues.name + " склад",
                    company_id: company?.dataValues.id,
                    admin: user?.dataValues.id,
                    type: "b2b склад"
                });

            }
        }

        if (!orderId) {
            return null;
        }
        const newProduct = await WareHouseProduct.create({
            order_id: orderId,
            warehouse_id: warehouse?.dataValues?.id,
        });

        console.log("prod: ", newProduct.dataValues.id);

        return newProduct;
    } catch (error) {
        console.log(error);
    }
}
