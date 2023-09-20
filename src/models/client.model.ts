
import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../core/db";

export const Client = sequelize.define("clients", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    where_from: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
});
