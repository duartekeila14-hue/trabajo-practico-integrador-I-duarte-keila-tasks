import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 20],
                isAlphanumeric: true,
            },
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user",
        },
    },
    {
        timestamps: true,
        paranoid: true,
        tableName: "Users",
    }
);