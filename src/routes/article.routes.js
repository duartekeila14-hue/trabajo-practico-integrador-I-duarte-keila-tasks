import { Router } from "express";
import {
    createArticle,
    getArticles,
    getArticleById,
    getMyArticles,
    getMyArticleById,
    updateArticle,
    deleteArticle,
} from "../controllers/article.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerMiddleware } from "../middlewares/owner.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    articleIdValidation,
    createArticleValidation,
    updateArticleValidation,
} from "../middlewares/validations/article.validation.js";

export const articleRoutes = Router();

// todas las rutas de articles requieren usuario autenticado
articleRoutes.use(authMiddleware);

articleRoutes.post("/", createArticleValidation, validate, createArticle);
articleRoutes.get("/", getArticles);

// IMPORTANTE: /user y /user/:id van ANTES de /:id, si no Express tomaría "user" como si fuera un id
articleRoutes.get("/user", getMyArticles);
articleRoutes.get("/user/:id", articleIdValidation, validate, getMyArticleById);

articleRoutes.get("/:id", articleIdValidation, validate, getArticleById);

// editar y eliminar: solo el autor o un admin (ownerMiddleware(true))
articleRoutes.put("/:id", updateArticleValidation, validate, ownerMiddleware(true), updateArticle);
articleRoutes.delete("/:id", articleIdValidation, validate, ownerMiddleware(true), deleteArticle);
