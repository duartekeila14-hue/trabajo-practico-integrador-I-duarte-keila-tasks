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
            references: { //references indica que una foreign key apunta a la columna id de users
                model: "Users", //especifica a cual model
                key: "id", // y a cual clave, en este caso id
                //un profile pertenece a un solo user (zz1:1)
            },
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        biography: {
            type: DataTypes.TEXT,//text sirve para textos largos
            allowNull: true, //puede quedar vacío
        },
        avatarUrl: {
            type: DataTypes.STRING(255), //lenght como para guardar una URL
            allowNull: true,
        },
        birthDate: {
            type: DataTypes.DATEONLY, //dateonly guarda dia, mes y año. Sin hora
            allowNull: true,
        },
    },
    {
        timestamps: true,
        tableName: "Profiles",
    }
);