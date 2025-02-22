const express = require('express')
const cors = require('cors')
const routes = require('./routes/routes.js')
const { generateToken } = require('./mw/auth');

// Instanciación del servidor
const app = express()

// Configurar middleware
app.use(cors());          // para evitar CORS
app.use(express.json());  // para parsear contenido JSON

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Utilizamos la función generateToken de auth.js para verificar las credenciales
    const result = await generateToken(username, password);

    if (result.token) {
        res.json({ token: result.token });  // Si el token es generado correctamente, lo enviamos como respuesta
    } else {
        res.status(401).json({ message: result.error });  // Si ocurre un error, lo respondemos con un mensaje
    }
});

app.use('/', routes)      // para enrutar peticiones

// Arranque del servidor
app.listen(5000, () => {
    console.log('server is listening on port 5000')
})
