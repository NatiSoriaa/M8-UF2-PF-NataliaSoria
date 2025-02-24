// Importamos el modelo de datos
const Library = require('../models/Library');

// Declaración de controladores 

const getBooks = async (req, res) => {
    try {
        // Instanciamos un modelo Library
        let library = new Library();
        // Lo usamos para listar libros
        let books = await library.listAll();
        res.json(books);
        library.close();
    }
    catch (err) {
        console.log("Error getting books...", err);
        res.status(500).json("Error getting books...");
    }
}

const createBook = async (req, res) => {
    try {
        // Verificamos el JWT para que solo los usuarios autenticados puedan crear libros
        jwtAuth(req, res, async () => {
            let library = new Library();

            // Creamos un libro nuevo
            const newBook = {
                title: req.body.title,
                author: req.body.author,
                year: req.body.year
            };

            // Usamos el modelo Library para crear libro
            let created = await library.create(newBook);

            if (created) {
                console.log("Product created successfully");
                res.json("Product created successfully");
            } else {
                console.log("Error creating new book...");
                res.status(400).json("Error creating new book...");
            }
            library.close();
        });
    }
    catch (err) {
        console.log("Error creating new book...", err);
        res.status(500).json("Error creating new book...");
    }
}

const updateBook = async (req, res) => {
    try {
        // Verificamos el JWT para que solo los usuarios autenticados puedan actualizar libros
        jwtAuth(req, res, async () => {
            let library = new Library();

            const bookID = req.body.id;
            const updateBooks = {
                title: req.body.title,
                author: req.body.author,
                year: req.body.year
            };

            let updated = await library.update(updateBooks, bookID);

            if (updated) {
                console.log("Book updated successfully");
                res.json("Book updated successfully");
            } else {
                console.log("Error updating book...");
                res.status(400).json("Error updating book...");
            }
            library.close();
        });
    }
    catch (err) {
        console.log("Error updating book...", err);
        res.status(500).json("Error updating book...");
    }
}

const deleteBook = async (req, res) => {
    try {
        // Verificamos el JWT para que solo los usuarios autenticados puedan eliminar libros
        jwtAuth(req, res, async () => {
            let library = new Library();

            let bookID = String(req.body.id);
            let deleted = await library.delete(bookID);

            if (deleted) {
                console.log("Book deleted successfully");
                res.json("Book deleted successfully");
            } else {
                console.log("Error deleting book...");
                res.status(400).json("Error deleting book...");
            }
            library.close();
        });
    }
    catch (err) {
        console.log("Error deleting book...", err);
        res.status(500).json("Error deleting book...");
    }
}

module.exports = {
    getBooks: getBooks,
    createBook: createBook,
    updateBook: updateBook,
    deleteBook: deleteBook
}
