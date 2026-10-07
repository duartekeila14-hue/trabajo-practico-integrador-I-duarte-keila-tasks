import { body, param } from "express-validator";
import { User } from "../../models/index.js";

export const articleIdValidation = [
    param("id").isInt({ min: 1 }).withMessage("El id debe ser un número entero positivo"),
];


const userIdRule = () =>
    body("user_id")
        .optional()
        .isInt({ min: 1 }).withMessage("user_id debe ser un número entero positivo")
        .custom(async (userId, { req }) => {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error("El usuario indicado en user_id no existe");
            }
            if (req.user.role !== "admin" && Number(userId) !== req.user.id) {
                throw new Error("user_id debe coincidir con el usuario autenticado");
            }
            return true;
        });

// required = true -> obligatorios (crear). required = false -> opcionales (actualizar)
const titleRule = (required) => {
    const rule = body("title")
        .trim()
        .notEmpty().withMessage("title es obligatorio")
        .isLength({ min: 3, max: 200 }).withMessage("title debe tener entre 3 y 200 caracteres");
    return required ? rule : rule.optional();
};

const contentRule = (required) => {
    const rule = body("content")
        .trim()
        .notEmpty().withMessage("content es obligatorio")
        .isLength({ min: 50, max: 10000 }).withMessage("content debe tener entre 50 y 10000 caracteres");
    return required ? rule : rule.optional();
};

const excerptRule = () =>
    body("excerpt")
        .optional({ values: "null" })
        .isString().withMessage("excerpt debe ser un texto")
        .isLength({ max: 500 }).withMessage("excerpt puede tener como máximo 500 caracteres");

const statusRule = () =>
    body("status")
        .optional()
        .isIn(["published", "archived"]).withMessage("status solo puede ser 'published' o 'archived'");

// POST /api/articles
export const createArticleValidation = [
    titleRule(true),
    contentRule(true),
    excerptRule(),
    statusRule(),
    userIdRule(),
];

// PUT /api/articles/:id
export const updateArticleValidation = [
    ...articleIdValidation,
    titleRule(false),
    contentRule(false),
    excerptRule(),
    statusRule(),
];
