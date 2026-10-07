import { body, param } from "express-validator";
import { Article, Tag, ArticleTag } from "../../models/index.js";

// POST /api/articles-tags: article_id y tag_id tienen que ser enteros, existir, y la asociación no puede estar repetida
export const createArticleTagValidation = [
    body("article_id")
        .notEmpty().withMessage("article_id es obligatorio")
        .isInt({ min: 1 }).withMessage("article_id debe ser un número entero positivo")
        .custom(async (articleId) => {
            const article = await Article.findByPk(articleId);
            if (!article) {
                throw new Error("El artículo indicado no existe");
            }
            return true;
        }),
    body("tag_id")
        .notEmpty().withMessage("tag_id es obligatorio")
        .isInt({ min: 1 }).withMessage("tag_id debe ser un número entero positivo")
        .custom(async (tagId) => {
            // verificamos que la etiqueta exista antes de asociarla a un artículo
            const tag = await Tag.findByPk(tagId);
            if (!tag) {
                throw new Error("La etiqueta indicada no existe");
            }
            return true;
        })
        .custom(async (tagId, { req }) => {
            const alreadyAssociated = await ArticleTag.findOne({
                where: { articleId: req.body.article_id, tagId },
            });
            if (alreadyAssociated) {
                throw new Error("El artículo ya tiene esa etiqueta");
            }
            return true;
        }),
];

// DELETE /api/articles-tags/:articleTagId
export const articleTagIdValidation = [
    param("articleTagId").isInt({ min: 1 }).withMessage("articleTagId debe ser un número entero positivo"),
];
