import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Article = sequelize.define(
    "Article",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        excerpt: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("published", "archived"),
            defaultValue: "published",
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        },
    },
    {
        timestamps: true,
        paranoid: true,
        tableName: "Articles",
    }
);