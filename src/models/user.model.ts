
import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../core/db";

export const User = sequelize.define("sellers", {
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
    password: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    company_id: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    comp_id: {
        type: DataTypes.UUID,
    },
    use_bot: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    bot_id: {
        type: DataTypes.BIGINT
    }
});
