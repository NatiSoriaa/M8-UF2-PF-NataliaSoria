const bcrypt = require('bcrypt');

async function generarHash() {
    const password = "1234"; // La contraseña que quieres almacenar
    const saltRounds = 10;
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Contraseña hasheada:", hashedPassword);
}

generarHash();
