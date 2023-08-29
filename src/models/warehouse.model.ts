import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../core/db";

export const Warehouse = sequelize.define("warehouse", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    company_id: {
        type: DataTypes.UUID,
    },
    admin: {
        type: DataTypes.UUID,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "NEW",
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: "склад",
    },
});
