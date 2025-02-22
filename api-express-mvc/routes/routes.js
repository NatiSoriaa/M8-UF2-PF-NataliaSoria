const express = require('express');
const books = require('../controllers/books.js');
const auth = require('../mw/auth'); // Asegúrate de que también has importado correctamente auth.js

// Instanciación del enrutador
const router = express.Router();

// Configuración de las rutas
router.get('/api/books', books.getBooks);
router.post('/api/books', auth.jwtAuth, books.createBook);  // Necesitas asegurarte de que auth.jwtAuth sea una función
router.put('/api/books', auth.jwtAuth, books.updateBook);    // Necesitas asegurarte de que auth.jwtAuth sea una función
router.delete('/api/books', auth.jwtAuth, books.deleteBook); // Necesitas asegurarte de que auth.jwtAuth sea una función

module.exports = router;
