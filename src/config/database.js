/*importamos sequelize para que pueda mapear los obj. JS*/
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
/*lee todo el contenido de las variables de entorno en el archivo env*/

/*declaramos y exportamos la función que conecta node.js con la bd usando Sequelize*/
export const sequelize = new Sequelize(  /*new Sequelize es para crear un nuevo obj sequelize que lea las siguientes parámetros*/ 
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