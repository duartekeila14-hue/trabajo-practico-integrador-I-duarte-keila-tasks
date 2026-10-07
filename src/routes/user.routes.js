import { Router } from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    userIdValidation,
    createUserValidation,
    updateUserValidation,
} from "../middlewares/validations/user.validation.js";

export const userRoutes = Router();

// todas las rutas de users son solo admin
userRoutes.use(authMiddleware, adminMiddleware);

userRoutes.get("/", getUsers);
userRoutes.get("/:id", userIdValidation, validate, getUserById);
userRoutes.post("/", createUserValidation, validate, createUser);
userRoutes.put("/:id", updateUserValidation, validate, updateUser);
userRoutes.delete("/:id", userIdValidation, validate, deleteUser);
