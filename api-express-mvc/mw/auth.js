const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecreto123';

// Función para generar el token
const generateToken = (user) => {
    const payload = { username: user.username };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
};

// Funcion de validacion del token
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

module.exports = { 
    jwtAuth,
    generateToken
};
