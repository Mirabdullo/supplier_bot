import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../core/db";

export const FurnitureType = sequelize.define("furniture_type", {
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
});

