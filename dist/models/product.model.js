"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../core/db");
const WareHouseProduct = db_1.sequelize.define("storeproducts", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
    },
    order_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: "order_id"
    },
    warehouse_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    is_copied: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: null
    }
}, {
    paranoid: true,
    freezeTableName: true
});
// WareHouseProduct.belongsTo(Orders, {foreignKey: "order_id", as: "order"})
module.exports = WareHouseProduct;
//# sourceMappingURL=product.model.js.map