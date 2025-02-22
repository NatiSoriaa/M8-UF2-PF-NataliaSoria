const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.JWT_SECRET || 'supersecreto123';  // Usar variable de entorno o una clave secreta por defecto

const hashedPassword = bcrypt.hashSync('1234', 10);
// Usuario estático (hardcodeado) - Para probar sin base de datos
const users = [
    {
        id: 1,
        username: 'admin',
        password: hashedPassword, // Contraseña 'admin123' en hash
    },
];

// Función para generar el JWT a partir del usuario y la contraseña
const generateToken = async (username, password) => {
    try {
        // Buscar usuario en el "array" de usuarios estáticos
        const user = users.find(user => user.username === username);
        if (!user) {
            return { error: 'Usuario no encontrado' };
        }

        // Comparar la contraseña proporcionada con la almacenada
        const isMatch = await bcrypt.compare(password, user.password);  // Aquí se compara correctamente
        if (!isMatch) {
            return { error: 'Contraseña incorrecta' };
        }

        // Generar el token JWT
        const payload = { username: user.username };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // El token expira en 1 hora
        return { token };
    } catch (err) {
        console.error('Error en autenticación:', err);
        return { error: 'Error interno del servidor' };
    }
};


// Middleware para verificar si el token es válido
const jwtAuth = (req, res, next) => {
    // Obtenemos el token de la cabecera Authorization
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
    }

    try {
        // Verificamos el token usando la clave secreta
        const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);

        // Añadimos los datos del usuario decodificados al request para que estén disponibles en los controladores
        req.user = decoded;
        next(); // Continuamos con la ejecución del siguiente middleware o controlador
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = {
    generateToken,
    jwtAuth
};
