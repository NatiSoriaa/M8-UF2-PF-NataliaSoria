const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/config.js'); // Ahora es el archivo correcto
const SECRET_KEY = process.env.JWT_SECRET || 'supersecreto123';

// Función para autenticar usuario y generar JWT
const generateToken = (user) => {
    const payload = { username: user.username };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '100h' });
    return token;
};

// Middleware para verificar si el token es válido
const jwtAuth = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

// Función para encontrar un usuario por su nombre de usuario
const findUserByUsername = async (username) => {
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows.length > 0 ? rows[0] : null; // Devuelve el primer usuario encontrado o null
    } catch (err) {
        console.error('Error en la consulta de la base de datos:', err);
        throw err;
    }
};

module.exports = {
    generateToken,
    jwtAuth,
    findUserByUsername
};
