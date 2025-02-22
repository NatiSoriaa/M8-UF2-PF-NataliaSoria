const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes.js');
const auth = require('./mw/auth');


const app = express();

// Configuración de middleware
app.use(cors());
app.use(express.json());

// Arrancar el servidor
app.listen(5000, () => {
    console.log('Servidor en puerto 5000');
});

app.use('/', routes);  // Enrutar peticiones
