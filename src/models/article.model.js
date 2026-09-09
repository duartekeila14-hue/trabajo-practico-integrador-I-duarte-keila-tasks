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
            validate: {
                len: [3, 200],
            },
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [50, 10000],
            },
        },
        excerpt: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                len: [0, 500],
            },
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