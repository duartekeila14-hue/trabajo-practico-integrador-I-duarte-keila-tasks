import { DataTypes } from "sequelize";
//datatypes es como una caja de herramienta que nos dice que tipo de dato puede adoptar cada columna
import { sequelize } from "../config/database.js";
//abrimos la conexión que ya hicimos desde database.js

export const User = sequelize.define( // creamos una constante llamada user y la exportamos para poder usar en otro archivos. 
    "User", //nombre del modelo
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, //mysql le adhiere una key automaticamente
        },
        username: {
            type: DataTypes.STRING(20), //establecemos el max de caracteres
            allowNull: false,
            unique: true, //no puede haber dos usuarios con el mismo username
            validate: { //validaciones realizadas antes de guardar
                len: [3, 20], // lenght min y max
                isAlphanumeric: true, //permite solo letras y num
            },
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true, // debe ser valido el formato del email
            },
        },
        password: {
            type: DataTypes.STRING(255), //255 para que sea suficiente para guardar el hasheo
            // el hasheo y las reglas de la contraseña se realiza en helper
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("user", "admin"), //solo puede uno de esos dos valores
            //ENUM es un tipo de dato especial que permite en este caso dos valores unicos posibles, de lo contrario, se rechaza el valor que no existe entre las opciones de ENUM
            defaultValue: "user", // el value default si no ingresamos uno es user
        },
    },
    {
        timestamps: true,
        paranoid: true, //con esto el registro "borrado" aparece en la columna deletedAt. Por lo que desaparece pero sigue existiendo en la bd.
        tableName: "Users",
    }
);