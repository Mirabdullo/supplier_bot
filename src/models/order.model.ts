import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../core/db";
import { Models } from "./model.model";
import { Deals } from "./deals";

export const Orders = sequelize.define("orders", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull: false,
    },
    order_id: {
        type: DataTypes.STRING(1024),
        allowNull: false,
    },
    cathegory: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    tissue: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT,
    },
    cost: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    sale: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sum: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    is_first: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    copied: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    deal_id: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING(1024),
        defaultValue: "NEW",
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    end_date: {
        type: DataTypes.DATE,
    },
    seller_id: {
        type: DataTypes.UUID,
    },
    model_id: {
        type: DataTypes.UUID,
    },
});

Orders.belongsTo(Models, { foreignKey: "model_id" });

Orders.belongsTo(Deals, { foreignKey: "deal_id"})