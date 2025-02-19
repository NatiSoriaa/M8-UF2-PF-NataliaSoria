const express = require('express')
const cors = require('cors')
const routes = require('./routes/routes.js')

// Instanciación del servidor
const app = express()

// Configurar middleware
app.use(cors());          // para evitar CORS
app.use(express.json());  // para parsear contenido JSON
app.use('/', routes)      // para enrutar peticiones

// Arranque del servidor
app.listen(5000, () => {
    console.log('server is listening on port 5000')
})
