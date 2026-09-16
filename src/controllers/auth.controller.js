import { User, Profile } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";


export const register = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, biography, avatarUrl, birthDate } = req.body;

        // Verificar si el username o email ya existen
        const existingByUsername = await User.findOne({ where: { username } });
        const existingByEmail = await User.findOne({ where: { email } });

        if (existingByUsername) {
            return res.status(400).json({
                message: "El nombre de usuario ya está registrado"
            });
        }

        if (existingByEmail) {
            return res.status(400).json({
                message: "El email ya está registrado"
            });
        }


        // Hashear la contraseña
        const hashedPassword = await hashPassword(password);

        // Crear el usuario
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "user", // por defecto
        });

        // Crear el perfil automáticamente
        const newProfile = await Profile.create({
            userId: newUser.id,
            firstName,
            lastName,
            biography: biography || null,
            avatarUrl: avatarUrl || null,
            birthDate: birthDate || null,
        });

        // Generar token
        const token = generateToken({
            id: newUser.id,
            role: newUser.role,
        });

        // Enviar cookie segura
        res.cookie("token", token, {
            httpOnly: true,
        });

        return res.status(201).json({
            message: "Usuario registrado correctamente",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                profile: newProfile,
            },
        });
    } catch (error) {
        console.error("Error en register:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const user = await User.findOne({
            where: { email },
            include: {
                model: Profile,
                as: "profile",
            },
        });

        if (!user) {
            return res.status(401).json({
                message: "Credenciales inválidas",
            });
        }

        // Comparar contraseña
        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: "Credenciales inválidas",
            });
        }

        // Generar token
        const token = generateToken({
            id: user.id,
            role: user.role,
        });

        // Enviar cookie segura
        res.cookie("token", token, {
            httpOnly: true,
            
        });

        return res.status(200).json({
            message: "Login exitoso",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profile: user.profile,
            },
        });
    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};


// usuario autenticado (con GET)

export const getProfile = async (req, res) => {
    try {
        // req.user viene del authMiddleware
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ["password"] },
            include: {
                model: Profile,
                as: "profile",
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            message: "Perfil obtenido correctamente",
            user,
        });
    } catch (error) {
        console.error("Error en getProfile:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};


//usuario autenticado

export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, biography, avatarUrl, birthDate } = req.body;

        const profile = await Profile.findOne({
            where: { userId: req.user.id },
        });

        if (!profile) {
            return res.status(404).json({
                message: "Perfil no encontrado",
            });
        }

        // Actualizar solo los campos que vienen
        const updates = {};

        if (firstName !== undefined) updates.firstName = firstName;
        if (lastName !== undefined) updates.lastName = lastName;
        if (biography !== undefined) updates.biography = biography;
        if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
        if (birthDate !== undefined) updates.birthDate = birthDate;

        await profile.update(updates);

        // Respuesta con el perfil actualizado
        return res.status(200).json({
            message: "Perfil actualizado correctamente",
            profile,
        });
    } catch (error) {
        console.error("Error en updateProfile:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

//usuario autenticado

export const logout = async (req, res) => {
    try {
        // Limpia la cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "Logout exitoso",
        });
    } catch (error) {
        console.error("Error en logout:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};