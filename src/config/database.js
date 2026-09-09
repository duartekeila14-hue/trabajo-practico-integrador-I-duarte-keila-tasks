/*importamos sequelize para que pueda mapear los obj. JS*/
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT || 3306,
        logging: false,
    }
);

export const startDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexión a la base de datos establecida.");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
};