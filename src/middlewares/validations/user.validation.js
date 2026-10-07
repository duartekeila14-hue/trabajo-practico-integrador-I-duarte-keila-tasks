import { body, param } from "express-validator";
import { User } from "../../models/index.js";
 
 
// devuelve true si el texto tiene solo letras (con tildes y ñ) y espacios
//una letra cambia al pasarla a mayúsculas o minúsculas; un número o un símbolo no cambia
const tieneSoloLetras = (texto) =>
    String(texto)
        .split("")
        .every((caracter) => caracter === " " || caracter.toLowerCase() !== caracter.toUpperCase());
 
// Para el update, el username/email puede ser el del propio usuario (req.params.id), no cuenta como repetido.
// Se busca con paranoid:false porque un usuario eliminado lógicamente sigue ocupando su username/email.
const isUsernameAvailable = async (username, { req }) => {
    const existing = await User.findOne({ where: { username }, paranoid: false });
    if (existing && String(existing.id) !== String(req.params.id)) {
        throw new Error("El nombre de usuario ya está registrado");
    }
    return true;
};
 
const isEmailAvailable = async (email, { req }) => {
    const existing = await User.findOne({ where: { email }, paranoid: false });
    if (existing && String(existing.id) !== String(req.params.id)) {
        throw new Error("El email ya está registrado");
    }
    return true;
};
 
// required = true -> obligatorio (crear). required = false -> opcional (actualizar)
export const usernameRule = (required = true) => {
    const rule = body("username")
        .trim()
        .notEmpty().withMessage("username es obligatorio")
        .isLength({ min: 3, max: 20 }).withMessage("username debe tener entre 3 y 20 caracteres")
        .isAlphanumeric().withMessage("username solo puede tener letras y números")
        .custom(isUsernameAvailable);
    return required ? rule : rule.optional();
};
 
export const emailRule = (required = true) => {
    const rule = body("email")
        .trim()
        .notEmpty().withMessage("email es obligatorio")
        .isLength({ max: 100 }).withMessage("email puede tener como máximo 100 caracteres")
        .isEmail().withMessage("email debe tener un formato válido")
        .custom(isEmailAvailable);
    return required ? rule : rule.optional();
};
 
export const passwordRule = (required = true) => {
    const rule = body("password")
        .notEmpty().withMessage("password es obligatorio")
        .isLength({ min: 8 }).withMessage("password debe tener al menos 8 caracteres")
        .custom((value) => {
            const texto = String(value);
            const tieneMinuscula = texto !== texto.toUpperCase(); // si cambia al pasarlo a mayúsculas, tenía alguna minúscula
            const tieneMayuscula = texto !== texto.toLowerCase(); // si cambia al pasarlo a minúsculas, tenía alguna mayúscula
            const tieneNumero = texto.split("").some((caracter) => caracter >= "0" && caracter <= "9");
 
            if (!tieneMinuscula || !tieneMayuscula || !tieneNumero) {
                throw new Error("password debe tener al menos una mayúscula, una minúscula y un número");
            }
            return true;
        });
    return required ? rule : rule.optional();
};
 
export const roleRule = () =>
    body("role")
        .optional()
        .isIn(["user", "admin"]).withMessage("role solo puede ser 'user' o 'admin'");
 
// Reglas del Profile. required = true para first_name y last_name al crear el perfil
export const profileRules = (required = true) => {
    const firstName = body("first_name")
        .trim()
        .notEmpty().withMessage("first_name es obligatorio")
        .isLength({ min: 2, max: 50 }).withMessage("first_name debe tener entre 2 y 50 caracteres")
        .custom((value) => {
            if (!tieneSoloLetras(value)) {
                throw new Error("first_name solo puede tener letras");
            }
            return true;
        });
 
    const lastName = body("last_name")
        .trim()
        .notEmpty().withMessage("last_name es obligatorio")
        .isLength({ min: 2, max: 50 }).withMessage("last_name debe tener entre 2 y 50 caracteres")
        .custom((value) => {
            if (!tieneSoloLetras(value)) {
                throw new Error("last_name solo puede tener letras");
            }
            return true;
        });
 
    return [
        required ? firstName : firstName.optional(),
        required ? lastName : lastName.optional(),
        body("biography")
            .optional({ values: "null" }) // opcional: se puede omitir o mandar null
            .isString().withMessage("biography debe ser un texto")
            .isLength({ max: 500 }).withMessage("biography puede tener como máximo 500 caracteres"),
        body("avatar_url")
            .optional({ values: "falsy" }) // opcional: se puede omitir, null o vacío
            .isURL().withMessage("avatar_url debe tener un formato de URL válido")
            .isLength({ max: 255 }).withMessage("avatar_url puede tener como máximo 255 caracteres"),
        body("birth_date")
            .optional({ values: "falsy" })
            .isISO8601({ strict: true }).withMessage("birth_date debe ser una fecha válida con formato YYYY-MM-DD")
            .custom((value) => {
                if (new Date(value) > new Date()) {
                    throw new Error("birth_date no puede ser una fecha futura");
                }
                return true;
            }),
    ];
};
 
// El id que viene por la URL tiene que ser un entero. Que exista se verifica en el controlador 
export const userIdValidation = [
    param("id").isInt({ min: 1 }).withMessage("El id debe ser un número entero positivo"),
];
 
// POST /api/users (admin): crea un usuario con su perfil
export const createUserValidation = [
    usernameRule(),
    emailRule(),
    passwordRule(),
    roleRule(),
    ...profileRules(),
];
 
// PUT /api/users/:id (admin): todos los campos son opcionales
export const updateUserValidation = [
    ...userIdValidation,
    usernameRule(false),
    emailRule(false),
    passwordRule(false),
    roleRule(),
];