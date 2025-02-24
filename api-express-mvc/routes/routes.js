const express = require('express');
const books = require('../controllers/books.js');

const Library = require('../models/Library'); 
const { jwtAuth, generateToken } = require('../mw/auth.js'); 
const bcrypt = require('bcrypt');

const router = express.Router();
const library = new Library();  

// Ruta para login (verificar usuario ya existente)
router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificar si el usuario existe
        const [users] = await library.connection.query('SELECT * FROM users WHERE username = ?', [username]); 
        if (users.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = users[0];

        // Comparar la contraseña con bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Si todo es correcto, generar el token
        const token = generateToken(user);

        res.json({ token });

    } catch (err) {
        console.error('Error en el login:', err);
        res.status(500).json({ message: 'Error interno en el servidor' });
    }
});


router.get('/api/books',books.getBooks);
router.post('/api/books', jwtAuth, books.createBook);
router.put('/api/books', jwtAuth, books.updateBook);
router.delete('/api/books', jwtAuth, books.deleteBook);

module.exports = router;
