import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../core/db";

export const Warehouse = sequelize.define("warehouse", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull: false,
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    admin: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "NEW",
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "склад",
    },
}, {
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
});
