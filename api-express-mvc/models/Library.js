const mysql = require("mysql2");
const dbConfig = require("../config/config.js");

class Library {
  constructor() {
    // En el constructor, creamos una conexión a la base de datos
    // y la guardamos en la propiedad connection de la clase

    // 1.Declaramos la conexión
    let connection = mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      database: dbConfig.DB
    });

    // 2.Abrimos la conexión
    connection.connect(error => {
      if (error) throw error;
      console.log("Successfully connected to the database.");
    });

    // 3.Dejamos la conexión en la propiedad connection, promisificada
    // (para poder utilizarlas más cómodamente en el resto de métodos de la clase)
    this.connection = connection.promise();
  }

  close = () => {
    this.connection.end();
  }

  // Métodos de la clase Library

  // Listar todos los libros
  listAll = async () => {
    const [results, fields] = await this.connection.query("SELECT * FROM books");
    return results;
  }

  // Crear un nuevo libro
  create = async (newBook) => {
    try {
      const [results, fields] = await this.connection.query("INSERT INTO books SET ?", newBook);
      return results.affectedRows;
    }
    catch (error) {
      return error;
    }
  };

  // Actualizar un libro
  update = async (updatedBook, bookId) => {
    try {
      const [results, fields] = await this.connection.query(
        "UPDATE books SET ? WHERE id = ?",
        [updatedBook, bookId]
      );
      return results.affectedRows;
    }
    catch (error) {
      return error;
    }
  };

  // Eliminar un libro
  delete = async (bookId) => {
    try {
      const [results, fields] = await this.connection.query(
        "DELETE FROM books WHERE id = ?",
        [bookId]
      );
      return results.affectedRows;
    }
    catch (error) {
      return error;
    }
  }
}

module.exports = Library;
