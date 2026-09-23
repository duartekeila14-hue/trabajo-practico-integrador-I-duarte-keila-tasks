import { Tag, Article } from "../models/index.js";
//traemos los modelos tag y article desde el archivo index.js


// POST /api/tags  (solo admin)
export const createTag = async (req, res) => { //exportamos la funcion. Es una función asíncrona porque espera a que traiga un resultado de una consulta en la base de datos.
    try { // pasa por 
        const { name } = req.body; // agarramos el campo name de lo que mandó el cliente (del cuerpo de la solcitud)

        // Verificamos si el nombre ya existe
        const existingTag = await Tag.findOne({ where: { name } });// buscamos en la base de datos si ya existe una etiqueta con ese mismo nombre

        if (existingTag) { //validación por si ya existe 
            return res.status(400).json({
                message: "El nombre de la etiqueta ya existe",
            });
        }

        const newTag = await Tag.create({ name }); // si no existe, creamos la nueva etiqueta con el nombre recibido

        return res.status(201).json({ // mensaje json por si se crea la nueva etiqueta
            message: "Etiqueta creada correctamente",
            tag: newTag, //devuelve la nueva etiqueta
        });
    } catch (error) {
        console.error("Error en createTag:", error); //agarramos el error para mostrar lo que salió mal en la consola. Podemos saber gracias a esto en que función hubo un error. Solo el programador puede ver

        
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message, //el primer error actua de variable mientras que el segundo es el error que capturamos con catch.
            //el error recibe la propiedad message 
        });
    }
};


// GET /api/tags  (usuario autenticado)

export const getTags = async (req, res) => {// lista todas las etiquetas
    try {
        const tags = await Tag.findAll(); // con el metodo finAll traemos todas las etiquetas de la base de datos

        return res.status(200).json({
            message: "Etiquetas obtenidas correctamente",
            tags,
        });
    } catch (error) {
        console.error("Error en getTags:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};


// GET /api/tags/:id  (solo admin)

export const getTagById = async (req, res) => { // exportamos la función. Es asíncrona porque va a esperar una consulta a la base de datos antes de responder
    try { // intentamos ejecutar el bloque de código; si algo falla, salta directo al catch de abajo
        const { id } = req.params; // extraemos por medio de la desestructuracion usando el objeto req.params que viene de la URL
        //la desestructuracion actua como propiedad extraida y tambien como nombre de variable que alberga el valor extraído

        const tag = await Tag.findByPk(id, { // findByPk significa "find by primary key", busca un registro puntual usando su clave primaria (el id)
            include: { // include le dice a Sequelize que además traiga datos relacionados de otra tabla, no solo la etiqueta sola
                model: Article, // el modelo relacionado que queremos incluir es Article (los artículos vinculados a esta etiqueta)
                as: "articles", // "as" define el alias con el que va a aparecer esa relación dentro del objeto tag, en este caso como "articles"
            },
        }); // cierra el objeto de opciones y la llamada a findByPk

        if (!tag) { // si tag es null o undefined (o sea, no se encontró ninguna etiqueta con ese id), entramos acá
            return res.status(404).json({ 
                message: "Etiqueta no encontrada", 
            });
        }

        return res.status(200).json({ 
            message: "Etiqueta obtenida correctamente", 
            tag, // devolvemos la etiqueta encontrada, junto con sus artículos relacionados gracias al include de arriba
        });
    } catch (error) { 
        console.error("Error en getTagById:", error);
        return res.status(500).json({ 
            message: "Error interno del servidor", 
            error: error.message, 
        });
    }
};


// PUT /api/tags/:id  (solo admin)

export const updateTag = async (req, res) => { // exportamos la función asíncrona encargada de actualizar una etiqueta
    try {
        const { id } = req.params; // extraemos el id de la etiqueta desde los parámetros de la URL
        const { name } = req.body; // extraemos el nuevo nombre que el cliente quiere asignarle a la etiqueta, desde el cuerpo de la solicitud

        const tag = await Tag.findByPk(id); // buscamos la etiqueta en la base de datos usando su id

        if (!tag) { // si no existe ninguna etiqueta con ese id
            return res.status(404).json({ //respondemos con status 400
                message: "Etiqueta no encontrada",
            });
        }

        // Verificar la unicidad si se está cambiando el nombre
        if (name && name !== tag.name) { // esta condición se cumple solo si el cliente mandó un nuevo nombre (name existe) Y ese nombre es distinto al que ya tenía la etiqueta
            const existingTag = await Tag.findOne({ where: { name } }); // buscamos si ya existe otra etiqueta en la base de datos con ese mismo nombre nuevo
            if (existingTag) { // validación por si encontramos una etiqueta que ya usa ese nombre
                return res.status(400).json({ 
                    message: "El nombre de la etiqueta ya existe",
                });
            }
        }

        await tag.update({ // el método update modifica el registro directamente en la base de datos con los nuevos valores
            name: name || tag.name, // si el cliente mandó un name nuevo lo usamos; si no mandó nada (name es undefined o vacío), dejamos el nombre que ya tenía la etiqueta sin cambios
        });

        return res.status(200).json({ 
            message: "Etiqueta actualizada correctamente",
            tag, // devolvemos la etiqueta ya actualizada
        });
    } catch (error) {
        console.error("Error en updateTag:", error); 
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message, // enviamos al cliente el mensaje específico de qué falló
        });
    }
};


// DELETE /api/tags/:id  (solo admin)

export const deleteTag = async (req, res) => { // exportamos la función asíncrona encargada de eliminar una etiqueta
    try {
        const { id } = req.params; // extraemos el id de la etiqueta a eliminar desde los parámetros de la URL

        const tag = await Tag.findByPk(id); // buscamos la etiqueta en la base de datos para confirmar que existe antes de intentar borrarla

        if (!tag) { // si no se encontró ninguna etiqueta con ese id
            return res.status(404).json({ // 404 porque no existe el recurso que se quiere eliminar
                message: "Etiqueta no encontrada",
            });
        }

        await tag.destroy(); // destroy es el método de Sequelize que elimina el registro de la base de datos de forma permanente

        return res.status(200).json({ // confirmando que la eliminación fue exitosa 
            message: "Etiqueta eliminada correctamente", // no se devuelve la etiqueta porque ya no existe más en la base de datos
        });
    } catch (error) {
        console.error("Error en deleteTag:", error); // registramos el error completo en la consola del servidor
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message, // mandamos al cliente el detalle puntual de qué salió mal
        });
    }
};