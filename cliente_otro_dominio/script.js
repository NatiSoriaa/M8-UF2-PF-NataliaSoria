document.addEventListener('DOMContentLoaded', () => {

    // Verificamos si el usuario está autenticado al cargar la página
    checkAuth();

    if (document.getElementById("book-table")) {
        fetchBooks(); 
    }
    if (document.querySelector("#createButton")) {
        document.querySelector('#createButton').addEventListener('click', createBook);
    }
    if (document.querySelector("#downloadButton")) {
        document.querySelector('#downloadButton').addEventListener('click', downloadVideo);
    }
    if (document.querySelector("#loginForm")) {
        document.querySelector("#loginForm").addEventListener("submit", loginUser);
    }
});

async function loginUser(event) {
    event.preventDefault(); // Prevenir el envío por defecto del formulario

    // Obtenemos los datos del formulario
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    // Enviamos los datos al backend para autenticar al usuario
    let apiUrl = "http://localhost:5000/api/login"; // Cambia a la URL de tu API de login
    let userData = { username: username, password: password };

    try {
        let response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        let data = await response.json();

        if (response.ok) {
            // Si la autenticación es exitosa, guardamos el token
            localStorage.setItem("token", data.token); // Guarda el token en localStorage

            // Redirigimos a la página principal
            window.location.href = "index.html"; // Redirige a la página de libros
        } else {
            // Si hay un error (usuario/contraseña incorrectos), mostramos un mensaje de error
            document.getElementById("errorMessage").innerText = data.error || "Error de autenticación";
        }
    } catch (error) {
        console.error("Error en el login:", error);
        document.getElementById("errorMessage").innerText = "Hubo un error con la solicitud.";
    }
}

// Función para verificar si el usuario tiene un token
async function checkAuth() {
    const token = localStorage.getItem('token');
    const actionsSection = document.getElementById("actions-section");

    if (!token) {
        console.log("No hay token. Acceso restringido.");
        if (actionsSection) actionsSection.style.display = "none";
        return;
    }

    // Verificar si el token es válido
    try {
        let response = await fetch("http://localhost:5000/api/books", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.log("Token inválido. Cerrando sesión...");
            localStorage.removeItem("token"); // Eliminar token inválido
            if (actionsSection) actionsSection.style.display = "none";
        } else {
            if (actionsSection) actionsSection.style.display = "block";
        }
    } catch (error) {
        console.error("Error al verificar autenticación:", error);
    }
}



async function fetchBooks() {
    let apiUrl = "http://localhost:5000/api/books";
    let res = await fetch(apiUrl);
    let books = await res.json();

    //Borramos el contenido de la tabla
    eraseTable();
    // Poblamos la tabla con el contenido del JSON
    updateTable(books);
}

function eraseTable() {
    let filas = Array.from(document.querySelectorAll('tbody tr'));
    for (let fila of filas) {
        fila.remove();
    }
}

function updateTable(books) {
    let table = document.getElementById("book-table");

    for (let book of books) {
        let row = document.createElement('tr');
        table.append(row);

        let celdaId = document.createElement('td');
        celdaId.innerHTML = book.id;
        row.append(celdaId);

        let celdaTitulo = document.createElement('td');
        celdaTitulo.innerHTML = book.title;
        celdaTitulo.contentEditable = true;
        row.append(celdaTitulo);

        let celdaAutor = document.createElement('td');
        celdaAutor.innerHTML = book.author;
        celdaAutor.contentEditable = true;
        row.append(celdaAutor);

        let celdaAno = document.createElement('td');
        celdaAno.innerHTML = book.year;
        celdaAno.contentEditable = true;
        row.append(celdaAno);

        let celdaAcciones = document.createElement('td');
        row.append(celdaAcciones);

        if (localStorage.getItem('token')) { // Si hay un token, mostrar los botones de editar y eliminar
            let buttonEdit = document.createElement('button');
            buttonEdit.innerHTML = "Modificar";
            buttonEdit.addEventListener('click', editBook);
            celdaAcciones.append(buttonEdit);

            let buttonDelete = document.createElement('button');
            buttonDelete.innerHTML = "Eliminar";
            buttonDelete.addEventListener('click', deleteBook);
            celdaAcciones.append(buttonDelete);
        }
    }
}

async function deleteBook(event) {
    let celdas = event.target.parentElement.parentElement.children;
    let id = celdas[0].innerHTML;
    let apiUrl = "http://localhost:5000/api/books";
    let deletedBook = { "id": id };

    let response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`  // Añadir el token en la cabecera
        },
        body: JSON.stringify(deletedBook)
    });
    let json = await response.json();
    console.log(json);
    fetchBooks();
}

async function editBook(event) {
    let celdas = event.target.parentElement.parentElement.children;
    let id = celdas[0].innerHTML;
    let titulo = celdas[1].innerHTML;
    let autor = celdas[2].innerHTML;
    let ano = celdas[3].innerHTML;

    let apiUrl = "http://localhost:5000/api/books";
    let modifiedBook = { "id": id, "title": titulo, "author": autor, "year": ano };

    let response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`  // Añadir el token en la cabecera
        },
        body: JSON.stringify(modifiedBook)
    });
    let json = await response.json();
    console.log(json);
    fetchBooks();
}

async function createBook(event) {
    let titulo = document.querySelector("#book-title").value;
    let autor = document.querySelector("#book-author").value;
    let ano = document.querySelector("#book-year").value;

    let apiUrl = "http://localhost:5000/api/books";
    let newBook = { title: titulo, author: autor, year: ano };

    let response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`  // Añadir el token en la cabecera
        },
        body: JSON.stringify(newBook)
    });
    let json = await response.json();
    console.log(json);
    fetchBooks();
}



function downloadVideo() {
    console.log('Donwloading video...');
    // 1. Create a new XMLHttpRequest object
    let xhr = new XMLHttpRequest();

    // 2. Configure it: GET-request for the URL /article/.../load
    xhr.open('GET', './vid.mp4');

    // 3. Set the responseType to 'blob' to handle binary data
    xhr.responseType = 'blob';

    // 4. Send the request over the network
    xhr.send();

    // 5. This will be called after the response is received
    xhr.onload = function () {
        if (xhr.status != 200) { // analyze HTTP status of the response
            console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        } else { // show the result
            console.log(`Done downloading video!`); // response is the server response

            // CREATE A TEMPORARY DOWNLOAD LINK
            // Create a blob URL for the video
            console.log(`Creating download link!`);
            const blob = new Blob([xhr.response], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);

            // Create a temporary download link
            const a = document.createElement('a');
            a.href = url;
            a.download = 'downloaded_video.mp4'; // Suggested file name
            document.body.appendChild(a);
            a.click();

            // Remove the temporary link
            document.body.removeChild(a);
        }
    };

    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            console.log(`Received ${event.loaded} of ${event.total} bytes`);
        } else {
            console.log(`Received ${event.loaded} bytes`); // no Content-Length
        }

    };

    xhr.onerror = function () {
        alconsole.log("Request failed");
    };
}