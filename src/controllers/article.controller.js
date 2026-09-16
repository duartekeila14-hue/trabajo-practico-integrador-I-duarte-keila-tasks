import { Article, User, Tag } from "../models/index.js";

// ============================================
// POST /api/articles  (usuario autenticado)
// ============================================
export const createArticle = async (req, res) => {
    try {
        const { title, content, excerpt, status } = req.body;

        const newArticle = await Article.create({
            title,
            content,
            excerpt: excerpt || null,
            status: status || "published",
            userId: req.user.id,
        });

        return res.status(201).json({
            message: "Artículo creado correctamente",
            article: newArticle,
        });
    } catch (error) {
        console.error("Error en createArticle:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

// ============================================
// GET /api/articles  (usuario autenticado)
// ============================================
export const getArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({
            where: { status: "published" },
            include: [
                {
                    model: User,
                    as: "author",
                    attributes: { exclude: ["password"] },
                },
                {
                    model: Tag,
                    as: "tags",
                },
            ],
        });

        return res.status(200).json({
            message: "Artículos obtenidos correctamente",
            articles,
        });
    } catch (error) {
        console.error("Error en getArticles:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

// ============================================
// GET /api/articles/:id  (usuario autenticado)
// ============================================
export const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;

        const article = await Article.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "author",
                    attributes: { exclude: ["password"] },
                },
                {
                    model: Tag,
                    as: "tags",
                },
            ],
        });

        if (!article) {
            return res.status(404).json({
                message: "Artículo no encontrado",
            });
        }

        return res.status(200).json({
            message: "Artículo obtenido correctamente",
            article,
        });
    } catch (error) {
        console.error("Error en getArticleById:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

// ============================================
// GET /api/articles/user  (usuario autenticado)
// ============================================
export const getMyArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({
            where: {
                userId: req.user.id,
                status: "published",
            },
            include: [
                {
                    model: Tag,
                    as: "tags",
                },
            ],
        });

        return res.status(200).json({
            message: "Artículos del usuario obtenidos correctamente",
            articles,
        });
    } catch (error) {
        console.error("Error en getMyArticles:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

// ============================================
// GET /api/articles/user/:id  (usuario autenticado)
// ============================================
export const getMyArticleById = async (req, res) => {
    try {
        const { id } = req.params;

        const article = await Article.findOne({
            where: {
                id,
                userId: req.user.id,
            },
            include: [
                {
                    model: Tag,
                    as: "tags",
                },
            ],
        });

        if (!article) {
            return res.status(404).json({
                message: "Artículo no encontrado",
            });
        }

        return res.status(200).json({
            message: "Artículo obtenido correctamente",
            article,
        });
    } catch (error) {
        console.error("Error en getMyArticleById:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

// ============================================
// PUT /api/articles/:id  (solo autor o admin)
// ============================================
export const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, excerpt, status } = req.body;

        const article = await Article.findByPk(id);

        if (!article) {
            return res.status(404).json({
                message: "Artículo no encontrado",
            });
        }

        await article.update({
            title: title ?? article.title,
            content: content ?? article.content,
            excerpt: excerpt ?? article.excerpt,
            status: status ?? article.status,
        });

        return res.status(200).json({
            message: "Artículo actualizado correctamente",
            article,
        });
    } catch (error) {
        console.error("Error en updateArticle:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

// ============================================
// DELETE /api/articles/:id  (solo autor o admin)
// ============================================
export const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;

        const article = await Article.findByPk(id);

        if (!article) {
            return res.status(404).json({
                message: "Artículo no encontrado",
            });
        }

        // Eliminar asociaciones con tags (cascada)
        await article.setTags([]);

        // Eliminación lógica
        await article.destroy();

        return res.status(200).json({
            message: "Artículo eliminado correctamente",
        });
    } catch (error) {
        console.error("Error en deleteArticle:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};