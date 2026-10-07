import { ArticleTag } from "../models/index.js";

export const createArticleTag = async (req, res) => {
    try {
        const articleTag = await ArticleTag.create({
            articleId: req.body.article_id,
            tagId: req.body.tag_id,
        });

        return res.status(201).json({
            message: "Etiqueta agregada al artículo correctamente",
            articleTag,
        });
    } catch (error) {
        console.error("Error en createArticleTag:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

export const deleteArticleTag = async (req, res) => {
    try {
        const articleTag = await ArticleTag.findByPk(req.params.articleTagId);

        if (!articleTag) {
            return res.status(404).json({
                message: "Asociación entre artículo y etiqueta no encontrada",
            });
        }

        await articleTag.destroy();

        return res.status(200).json({
            message: "Etiqueta removida del artículo correctamente",
        });
    } catch (error) {
        console.error("Error en deleteArticleTag:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};
