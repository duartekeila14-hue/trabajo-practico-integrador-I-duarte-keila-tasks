import { Article, ArticleTag } from "../models/index.js";

// Busca el artículo que está en juego en la petición, según la ruta:
//  DELETE /articles-tags/:articleTagId -> el artículo al que pertenece esa asociación
//  POST /articles-tags                 -> el artículo que viene en el body (article_id)
//  PUT/DELETE /articles/:id            -> el artículo del param id
const findArticleOfRequest = async (req) => {
    if (req.params.articleTagId) {
        const articleTag = await ArticleTag.findByPk(req.params.articleTagId);
        return articleTag ? await Article.findByPk(articleTag.articleId) : null;
    }

    const articleId = req.params.id || (req.body && req.body.article_id);
    return await Article.findByPk(articleId);
};

// Verifica que el usuario autenticado sea el propietario (autor) del artículo.
// ownerMiddleware()     -> solo el autor
// ownerMiddleware(true) -> el autor o un admin
// (siempre se usa DESPUÉS de authMiddleware)
export const ownerMiddleware = (allowAdmin = false) => {
    return async (req, res, next) => {
        try {
            const article = await findArticleOfRequest(req);

            if (!article) {
                return res.status(404).json({ message: "Artículo no encontrado" });
            }

            const isOwner = article.userId === req.user.id;
            const isAllowedAdmin = allowAdmin && req.user.role === "admin";

            if (!isOwner && !isAllowedAdmin) {
                return res.status(403).json({
                    message: allowAdmin
                        ? "Solo el autor o un administrador puede realizar esta acción"
                        : "Solo el autor puede realizar esta acción",
                });
            }

            next();
        } catch (error) {
            console.error("Error en ownerMiddleware:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };
};
