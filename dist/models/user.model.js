"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../core/db");
exports.User = db_1.sequelize.define("sellers", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.UUIDV4,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false,
    },
    company_id: {
        type: sequelize_1.DataTypes.STRING(256),
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.STRING(32),
        allowNull: false,
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    comp_id: {
        type: sequelize_1.DataTypes.UUID,
    },
});
//# sourceMappingURL=user.model.js.map