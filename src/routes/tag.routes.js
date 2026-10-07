import { Router } from "express";
import {
    createTag,
    getTags,
    getTagById,
    updateTag,
    deleteTag,
} from "../controllers/tag.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    tagIdValidation,
    createTagValidation,
    updateTagValidation,
} from "../middlewares/validations/tag.validation.js";

export const tagRoutes = Router();

// listar etiquetas: cualquier usuario autenticado
tagRoutes.get("/", authMiddleware, getTags);

// el resto: solo admin
tagRoutes.post("/", authMiddleware, adminMiddleware, createTagValidation, validate, createTag);
tagRoutes.get("/:id", authMiddleware, adminMiddleware, tagIdValidation, validate, getTagById);
tagRoutes.put("/:id", authMiddleware, adminMiddleware, updateTagValidation, validate, updateTag);
tagRoutes.delete("/:id", authMiddleware, adminMiddleware, tagIdValidation, validate, deleteTag);
