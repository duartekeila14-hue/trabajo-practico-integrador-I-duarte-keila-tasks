import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Profile = sequelize.define(
    "Profile",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: "Users",
                key: "id",
            },
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [2, 50],
                isAlpha: true,
            },
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [2, 50],
                isAlpha: true,
            },
        },
        biography: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [0, 500],
            },
        },
        avatarUrl: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
    },
    {
        timestamps: true,
        tableName: "Profiles",
    }
);