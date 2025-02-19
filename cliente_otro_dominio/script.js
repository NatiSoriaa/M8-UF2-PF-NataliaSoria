
window.onload = () => {
    // Pedimos a la API los libros actuales en base de datos
    fetchBooks();

    // Añadimos al botón de submit del formulario un listener para enlazarlo a la función createBook
    document.querySelector('#createButton').addEventListener('click', createBook);

    document.querySelector('#downloadButton').addEventListener('click', downloadVideo);
}

async function fetchBooks() {
    let apiUrl = "http://localhost:5000/api/books";
    let res = await fetch(apiUrl);
    let books = await res.json();
    // console.log(books);

    //Borramos el contenido de la tabla
    eraseTable();
    // Poblamos la tabla con el contenido del JSON
    updateTable(books);
}

function eraseTable() {
    // Accedemos a la lista de filas de la tabla <tr> y las borramos todas
    let filas = Array.from(document.querySelectorAll('tbody tr'));
    for (let fila of filas) {
        fila.remove();
    }
}

function updateTable(books) {
    let table = document.getElementById("book-table");

    // Iteramos books: por cada book
    for (let book of books) {
        // Creamos y añadimos a la tabla una nueva fila (<tr>)
        let row = document.createElement('tr');
        table.append(row);
        // Creamos y añadimos a la fila las celdas de id, título, autor, año, acciones.
        // Las celdas id, título, autor, año se deben rellenar con la info del JSON.
        // Las celdas título, autor, año deben tener el atributo contenteditable a true.
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
        // Creamos dos botones (editar y eliminar) y los añadimos a la celda acciones.
        // Hay que añadir a cada botónn el listener correspondiente para enlazarlos a las funciones editBook i deleteBook, respectivamente.
        let celdaAcciones = document.createElement('td');
        row.append(celdaAcciones);
        let buttonEdit = document.createElement('button');
        buttonEdit.innerHTML = "Modificar";
        buttonEdit.addEventListener('click', (event) => editBook(event, book._id));
        celdaAcciones.append(buttonEdit);
        let buttonDelete = document.createElement('button');
        buttonDelete.innerHTML = "Eliminar";
        buttonDelete.addEventListener('click', (event) => deleteBook(event, book._id)); 
        celdaAcciones.append(buttonDelete);

    }
}

async function deleteBook(event, bookID) {
    // Leemos el contenido de la columna id de esa fila
    let celdas = event.target.parentElement.parentElement.children;
    let id = celdas[0].innerHTML;
    // Hacemos la petición de DELETE a la API pasando un json en el cuerpo del mensaje
    let apiUrl = "http://localhost:5000/api/books";

    let response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: bookID })
    });
    let json = await response.json()
    // Muestra respuesta de la API (JSON) por consola
    console.log(json);

    // Volvemos a pedir libros
    fetchBooks();
}

async function editBook(event, bookID) {
    // Leemos el contenido de las columnas id, título, autor, año de esa fila
    let celdas = event.target.parentElement.parentElement.children;
    let id = celdas[0].innerHTML;
    let titulo = celdas[1].innerHTML;
    let autor = celdas[2].innerHTML;
    let ano = celdas[3].innerHTML;

    // Hacemos la petición de PUT correspondiente pasando un json en el cuerpo del mensaje
    // p.ej. { "id": 1, "title": "titulo", "author": "autor", "year": 1980 }
    let apiUrl = "http://localhost:5000/api/books"
    let modifiedBook = {
        _id: bookID,
        title: titulo,
        author: autor,
        year: ano
    }
    let response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(modifiedBook)
    });
    let json = await response.json()
    // Muestra respuesta de la API (JSON) por consola
    console.log(json);

    //Volvemos a pedir libros
    fetchBooks();
}

async function createBook(event) {
    // Leemos el contenido del formulario: título, autor, año
    let titulo = document.querySelector("#book-title").value;
    let autor = document.querySelector("#book-author").value;
    let ano = document.querySelector("#book-year").value;

    // Hacemos la petición de POST correspondiente pasando un json en el cuerpo del mensaje
    // p.ej. { "title": "titulo", "author": "autor", "year": 1980 }
    // No añadir id, es autoincremental
    let apiUrl = "http://localhost:5000/api/books";
    let newBook = {
        title: titulo,
        author: autor,
        year: ano
    }
    let response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook)
    });
    let json = await response.json()
    // Muestra respuesta de la API (JSON) por consola
    console.log(json);

    //Volvemos a pedir libros
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