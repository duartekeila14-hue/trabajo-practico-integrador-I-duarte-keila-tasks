import { body } from "express-validator";
import {
    usernameRule,
    emailRule,
    passwordRule,
    profileRules,
} from "./user.validation.js";

// POST /api/auth/register: datos del usuario + datos del perfil que se crea automáticamente
export const registerValidation = [
    usernameRule(),
    emailRule(),
    passwordRule(),
    ...profileRules(),
];

// POST /api/auth/login: se puede entrar con email o con username, más la contraseña
export const loginValidation = [
    body("email").custom((value, { req }) => {
        if (!value && !(req.body && req.body.username)) {
            throw new Error("Debes enviar email o username");
        }
        return true;
    }),
    body("email").optional().isEmail().withMessage("email debe tener un formato válido"),
    body("password").notEmpty().withMessage("password es obligatorio"),
];

// PUT /api/auth/profile: todos los campos del perfil son opcionales
export const updateProfileValidation = [...profileRules(false)];
