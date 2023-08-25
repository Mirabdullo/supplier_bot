import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../core/db";
import { Orders } from "./order.model";

export const WareHouseProduct = sequelize.define("storeproducts", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull: false,
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "order_id",
    },
    warehouse_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    is_copied: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});


WareHouseProduct.belongsTo(Orders, {foreignKey: "order_id"} )