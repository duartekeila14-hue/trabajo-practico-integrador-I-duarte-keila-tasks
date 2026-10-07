import { Router } from "express";
import {
    createArticleTag,
    deleteArticleTag,
} from "../controllers/articleTag.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerMiddleware } from "../middlewares/owner.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createArticleTagValidation,
    articleTagIdValidation,
} from "../middlewares/validations/articleTag.validation.js";

export const articleTagRoutes = Router();

// agregar y remover etiquetas de un artículo: solo el autor (ownerMiddleware() sin admin)
articleTagRoutes.post("/", authMiddleware, createArticleTagValidation, validate, ownerMiddleware(), createArticleTag);
articleTagRoutes.delete("/:articleTagId", authMiddleware, articleTagIdValidation, validate, ownerMiddleware(), deleteArticleTag);
