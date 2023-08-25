"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../core/db");
const Orders = db_1.sequelize.define("orders", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.UUIDV4,
        allowNull: false,
    },
    order_id: {
        type: sequelize_1.DataTypes.STRING(1024),
        allowNull: false,
    },
    cathegory: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    tissue: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.TEXT,
    },
    cost: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    sale: {
        type: sequelize_1.DataTypes.DECIMAL,
        allowNull: false,
    },
    qty: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    sum: {
        type: sequelize_1.DataTypes.DECIMAL,
        allowNull: false,
    },
    is_first: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    copied: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(1024),
        defaultValue: "NEW",
        allowNull: false,
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    end_date: {
        type: sequelize_1.DataTypes.DATE,
    },
    seller_id: {
        type: sequelize_1.DataTypes.UUID
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: null
    }
}, {
    paranoid: true,
});
module.exports = Orders;
//# sourceMappingURL=order.model.js.map