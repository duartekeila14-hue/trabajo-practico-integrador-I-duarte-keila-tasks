import { body, param } from "express-validator";
import { Tag } from "../../models/index.js";
 
// El nombre no puede estar repetido. En el update, el nombre puede ser el de la misma etiqueta.
const isTagNameAvailable = async (name, { req }) => {
    const existing = await Tag.findOne({ where: { name } });
    if (existing && String(existing.id) !== String(req.params.id)) {
        throw new Error("El nombre de la etiqueta ya existe");
    }
    return true;
};
 
const nameRule = () =>
    body("name")
        .trim()
        .notEmpty().withMessage("name es obligatorio")
        .isLength({ min: 2, max: 30 }).withMessage("name debe tener entre 2 y 30 caracteres")
        .custom((value) => {
            if (String(value).includes(" ")) {
                throw new Error("name no puede tener espacios");
            }
            return true;
        })
        .custom(isTagNameAvailable);
 
export const tagIdValidation = [
    param("id").isInt({ min: 1 }).withMessage("El id debe ser un número entero positivo"),
];
 
export const createTagValidation = [nameRule()];
 
export const updateTagValidation = [...tagIdValidation, nameRule()];
 