import { User, Profile, Article } from "../models/index.js"; // traemos los modelos User, Profile y Article desde el archivo index.js para poder consultar y modificar esas tablas de la base de datos
import { hashPassword } from "../helpers/bcrypt.helper.js"; // traemos la función hashPassword desde un archivo de ayuda (helper), que sirve para encriptar contraseñas antes de guardarlas


// GET /api/users  (solo admin)

export const getUsers = async (req, res) => { // exportamos la función asíncrona que devuelve todos los usuarios
    try {
        const users = await User.findAll({ // findAll es un método que trae todos los registros de la tabla usuarios
            attributes: { exclude: ["password"] }, // attributes controla qué columnas se traen; exclude le dice que traiga todas MENOS la columna password, para no exponer contraseñas (ni siquiera encriptadas) en la respuesta, por eso el exclude
            include: { // include trae datos relacionados de otra tabla junto con cada usuario
                model: Profile, // el modelo relacionado a incluir es Profile (el perfil de cada usuario)
                as: "profile", // as define el alias con el que aparecerá esa relación dentro de cada objeto usuario, en este caso como "profile"
            },
        });

        return res.status(200).json({ 
            message: "Usuarios obtenidos correctamente", 
            users, // devolvemos el array con todos los usuarios (sus perfiles incluidos, sin las contraseñas)
        });
    } catch (error) { 
        console.error("Error en getUsers:", error); 
        return res.status(500).json({ 
            message: "Error interno del servidor", 
            error: error.message, 
        });
    }
};


// GET /api/users/:id  (solo admin)

export const getUserById = async (req, res) => { // exportamos la función asíncrona que busca un usuario por su id
    try {
        const { id } = req.params; // extraemos el id desestructurando desde los parámetros de la URL 

        const user = await User.findByPk(id, { // findByPk busca un registro puntual usando su clave primaria (el id)
            attributes: { exclude: ["password"] }, // de nuevo, excluimos la columna password para no exponerla en la respuesta
            include: [ // acá include es un array (a diferencia de getUsers, que usaba un objeto), porque estamos incluyendo MÁS de una relación al mismo tiempo
                {
                    model: Profile, // primera relación a incluir: el perfil del usuario
                    as: "profile", // alias con el que aparecerá esa relación
                },
                {
                    model: Article, // segunda relación a incluir: los artículos escritos por ese usuario
                    as: "articles", 
                },
            ], 
        });

        if (!user) { // si no se encontró ningún usuario con ese id (user es null)
            return res.status(404).json({ 
                message: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            message: "Usuario obtenido correctamente",
            user, // devolvemos el usuario junto con su perfil y sus artículos, gracias al include
        });
    } catch (error) {
        console.error("Error en getUserById:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

// POST /api/users  (solo admin)
export const createUser = async (req, res) => { // exportamos la función asíncrona encargada de crear un usuario
    try {
        const { username, email, password, role, firstName, lastName, biography, avatarUrl, birthDate } = req.body;
        // desestructuramos del cuerpo de la solicitud todos los campos que el cliente mandó para crear el usuario y su perfil

        const existingUsername = await User.findOne({ where: { username } }); // buscamos si ya existe un usuario con ese mismo username
        const existingEmail = await User.findOne({ where: { email } }); // buscamos si ya existe un usuario con ese mismo email
        // estas dos búsquedas se ejecutan una después de la otra (secuencialmente), no en simultáneo, porque cada await espera a que termine la anterior antes de seguir

        if (existingUsername || existingEmail) { //  || (OR) hace que esta condición se cumpla si SE ENCONTRÓ el username, O SE ENCONTRÓ el email, o ambos. Entra al mensaje json de ser afirmativo
            return res.status(400).json({ 
                message: "El username o el email ya están registrados",
            });
        }

        const hashedPassword = await hashPassword(password); // encriptamos la contraseña en texto plano que mandó el cliente, para no guardar contraseñas legibles en la base de datos

        const newUser = await User.create({ // create es un método que inserta un nuevo registro en la tabla User y devuelve el registro ya creado
            username, 
            email, 
            password: hashedPassword, // guardamos la versión encriptada de la contraseña, nunca la original
            role: role || "user", // si el cliente mandó un role lo usamos; si no mandó nada, por defecto asignamos el rol "user"
        });

        const newProfile = await Profile.create({ // creamos también el perfil asociado a este usuario nuevo, en la tabla Profile
            userId: newUser.id, // vinculamos el perfil al usuario recién creado, usando el id que Sequelize le asignó automáticamente al crearlo
            firstName, 
            lastName, 
            biography: biography || null, // si no mandaron biografía, guardamos null en vez de undefined (más prolijo para la base de datos)
            avatarUrl: avatarUrl || null, 
            birthDate: birthDate || null, 
        });

        return res.status(201).json({ // 201 significa "Created", el código correcto cuando se creó un recurso nuevo exitosamente
            message: "Usuario creado correctamente",
            user: { // armamos manualmente un objeto de respuesta en vez de devolver newUser completo
                id: newUser.id, // incluimos el id del usuario nuevo
                username: newUser.username, // incluimos el username
                email: newUser.email, // incluimos el email
                role: newUser.role, // incluimos el rol asignado
                profile: newProfile, // incluimos el perfil recién creado
                // nota: notá que acá NO se incluye la password (ni siquiera la encriptada), justamente para no exponerla en la respuesta al cliente
            },
        });
    } catch (error) {
        console.error("Error en createUser:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

// PUT /api/users/:id  (solo admin)
export const updateUser = async (req, res) => { // exportamos la función asíncrona encargada de actualizar un usuario
    try {
        const { id } = req.params; // extraemos el id del usuario a actualizar, desde la URL
        const { username, email, password, role } = req.body; // extraemos los campos que el cliente quiere actualizar, desde el cuerpo de la solicitud

        const user = await User.findByPk(id); // buscamos el usuario en la base de datos usando su id

        if (!user) { 
            return res.status(404).json({ 
                message: "Usuario no encontrado",
            });
        }

        if (username && username !== user.username) { // esta condición se cumple solo si el cliente mandó un username nuevo Y ese username es distinto al que ya tenía el usuario
            //el primer username viene del req.body
            //el segundo username es una propiedad del obj user
            const existingUsername = await User.findOne({ where: { username } }); // buscamos si ya existe otro usuario con ese nuevo username
            if (existingUsername) {
                return res.status(400).json({ 
                    message: "El username ya está registrado",
                });
            }
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ where: { email } }); // buscamos si ya existe otro usuario con ese nuevo email
            if (existingEmail) { 
                return res.status(400).json({ 
                    message: "El email ya está registrado",
                });
            }
        }

        const updatedData = { // armamos un objeto con los datos finales que vamos a guardar en la base de datos
            username: username || user.username, // si mandaron un username nuevo lo usamos, si no, mantenemos el que ya tenía
            email: email || user.email, 
            role: role || user.role, 
        };

        if (password) { // esta condición se cumple solo si el cliente mandó una nueva contraseña (si no mandó nada, password sería undefined, que es "falsy")
            updatedData.password = await hashPassword(password); // encriptamos la nueva contraseña y la agregamos al objeto updatedData
            // esto está FUERA del objeto updatedData inicial; se agrega como propiedad extra solo si hace falta, para no encriptar ni tocar la contraseña si el cliente no pidió cambiarla
        }

        await user.update(updatedData); // aplicamos todos los cambios juntos sobre el registro del usuario en la base de datos. Esos cambios viene de updatedData que está entre paréntesis

        return res.status(200).json({ 
            message: "Usuario actualizado correctamente",
            user: { // igual que en createUser, armamos manualmente la respuesta para no exponer la contraseña (ni la encriptada)
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Error en updateUser:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

// DELETE /api/users/:id  (solo admin)
export const deleteUser = async (req, res) => { // exportamos la función asíncrona encargada de eliminar un usuario
    try {
        const { id } = req.params; // extraemos el id del usuario a eliminar, desde la URL

        const user = await User.findByPk(id); // buscamos el usuario en la base de datos para confirmar que existe antes de borrarlo

        if (!user) { 
            return res.status(404).json({ 
                message: "Usuario no encontrado",
            });
        }

        await user.destroy(); // destroy es el método de instancia que elimina el registro de la base de datos de forma permanente

        return res.status(200).json({ 
            message: "Usuario eliminado correctamente", // no se devuelve el usuario porque ya no existe más en la base de datos
        });
    } catch (error) {
        console.error("Error en deleteUser:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};