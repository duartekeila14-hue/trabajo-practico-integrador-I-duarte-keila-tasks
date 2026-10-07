/*traemos todas las librerías necesarias*/
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { authRoutes } from "./src/routes/auth.routes.js";
import { userRoutes } from "./src/routes/user.routes.js";
import { articleRoutes } from "./src/routes/article.routes.js";
import { tagRoutes } from "./src/routes/tag.routes.js";
import { articleTagRoutes } from "./src/routes/articleTag.routes.js";

dotenv.config();
/*permite cargar las variables de entorno del archivo env para leer los process.env*/

import { startDB } from "./src/config/database.js";
/*ingresamos a la bd desde database*/

const app = express(); /*arrancamos nuestro servidor app con express*/
const PORT = process.env.PORT || 3000; /*creamos otro const que se llama port para que escuche el puerto de la bd usando el process.env*/


app.use(express.json()); //middleware que convierte el cuerpo de las peticiones en JSON. Ej. desde el front manda {"name":"Serena"}, Express lo transforma gracias al método en un objeto JS accesible con req.body
app.use(cookieParser()); //midddleware que lee las cookies enviadas por el cliente. Se puede acceder a ellas con req.cookies
app.use(
    cors({ //middleware que habilita a CORS para hacer peticiones al backend
        origin: "http://localhost:5173", //solamente desde este dominio permite solicitudes de peticiones
        credentials: true, //habilita el envío de cookies junto con las peticiones
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/articles-tags", articleTagRoutes);

try {
    await startDB();
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
} catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
    process.exitCode = 1;
}

export default app; //exportamos la instancia de express