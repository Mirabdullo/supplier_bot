import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../core/db";
import { FurnitureType } from "./furniture_type.model";


export const Model = sequelize.define("model", {
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
    price: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
    },
    sale: {
        type: DataTypes.DECIMAL,
    },
    code: {
        type: DataTypes.STRING,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    company_id: {
        type: DataTypes.UUID,
    },
    status: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "NEW",
    },
    type_id: {
        type: DataTypes.UUID,
    }
});

Model.belongsTo(FurnitureType, {foreignKey: "type_id"})