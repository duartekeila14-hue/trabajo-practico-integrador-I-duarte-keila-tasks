import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const ArticleTag = sequelize.define(
    "ArticleTag",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        articleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Articles",
                key: "id",
            },
        },
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Tags",
                key: "id",
            },
        },
    },
    {
        timestamps: true,
        tableName: "ArticleTags",
    }
);