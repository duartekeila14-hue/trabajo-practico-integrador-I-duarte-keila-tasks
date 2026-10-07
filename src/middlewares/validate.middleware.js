import { validationResult } from "express-validator";

// Middleware que corta la petición con 400 si alguna validación de express-validator falló
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Errores de validación",
            // devolvemos solo el campo y el mensaje (no el valor, para no devolver contraseñas)
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg,
            })),
        });
    }

    next();
};