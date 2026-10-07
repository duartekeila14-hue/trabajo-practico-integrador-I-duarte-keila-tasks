import { verifyToken } from "../helpers/jwt.helper.js";
import { User } from "../models/index.js";

// Verifica el JWT que viene en la cookie y deja los datos del usuario en req.user
export const authMiddleware = async (req, res, next) => {
    try {
        // Obtener token de la cookie
        const token = req.cookies && req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "No autenticado" });
        }

        // Verificar y decodificar token (si está vencido o fue modificado, verifyToken lanza un error)
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (error) {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }

        // Confirmamos que el usuario siga existiendo (un usuario eliminado lógicamente ya no puede entrar)
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "El usuario ya no existe" });
        }

        // Almacenar datos del usuario. El rol se toma de la base de datos, así un cambio de rol se aplica enseguida
        req.user = {
            id: user.id,
            username: user.username,
            role: user.role,
        };

        next();
    } catch (error) {
        console.error("Error en authMiddleware:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
