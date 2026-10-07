import bcrypt from "bcrypt";

// Hashear contraseña
export const hashPassword = async (password) => {
    const saltRounds = 10; 
    return await bcrypt.hash(password, saltRounds);
};

// Verificaciónd de la  contraseña, compara la ingresada con el hash guardado
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};