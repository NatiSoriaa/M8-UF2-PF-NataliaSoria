-- Crear la base de datos (opcional)
CREATE DATABASE IF NOT EXISTS books;
USE books;

-- Crear la tabla "books"
CREATE TABLE books (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    year INT NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Insertar los datos
INSERT INTO books (id, title, author, year) VALUES
(1, 'Don Quijote de la Mancha', 'Miguel de Cervantes', 1605),
(2, 'Moby Dick', 'Herman Melville', 1851),
(3, 'Orgullo y Prejuicio', 'Jane Austen', 1813),
(4, 'Crimen y Castigo', 'Fyodor Dostoevsky', 1866),
(5, 'La Odisea', 'Homero', -800);

INSERT INTO users (username, password) VALUES ('admin', '$2b$10$D0TKgsxEkbQ/bNzvw5YR6eAfrcARBuBjwUDDmsE8aYLbteUAt0u/W');