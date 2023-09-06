import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../core/db";
import { Orders } from "./order.model";

export const Deals = sequelize.define("deals", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        allowNull: false,
    },
    deal_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    rest: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },    
    copied: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },    
    delivery_date: {
        type: DataTypes.DATE,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "NEW"
    },
    company_id: {
        type: DataTypes.STRING,
        allowNull: false
    }

})

