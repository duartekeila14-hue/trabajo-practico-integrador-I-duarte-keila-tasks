import { Router } from "express";
import {
    register,
    login,
    getProfile,
    updateProfile,
    logout,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    registerValidation,
    loginValidation,
    updateProfileValidation,
} from "../middlewares/validations/auth.validation.js";

export const authRoutes = Router();

// Rutas públicas
authRoutes.post("/register", registerValidation, validate, register);
authRoutes.post("/login", loginValidation, validate, login);

// Rutas protegidas (usuario autenticado)
authRoutes.get("/profile", authMiddleware, getProfile);
authRoutes.put("/profile", authMiddleware, updateProfileValidation, validate, updateProfile);
authRoutes.post("/logout", authMiddleware, logout);
