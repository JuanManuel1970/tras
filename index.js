const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;
require('./conexion/conexion');
const Usuario = require('./model/userModel');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`<h1>Soy el Back del MERN</h1>`);
});

app.post('/usuarios', async (req, res) => {
  console.log(req.body);
  const { nombre, apellido, email, password } = req.body;

  console.log(`Mi nombre es ${nombre}, mi apellido es ${apellido}, mi email es ${email} y el password ${password}`);

  // Realiza el hash de la contraseña antes de guardarla en la base de datos
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crea un nuevo usuario con la contraseña hasheada
  const nuevoUsuario = new Usuario({
    nombre,
    apellido,
    email,
    password: hashedPassword,
  });

  console.log(`1. Nuevo Usuario a guardar: ${nuevoUsuario}`);

  await nuevoUsuario.save();

  res.json({
    saludo: 'Dato guardado'
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca al usuario en la base de datos por su email
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      // El usuario no existe en la base de datos
      return res.json({ success: false, message: 'Credenciales incorrectas. Por favor, verifica tus datos.' });
    }

    // Compara la contraseña ingresada con la contraseña hasheada en la base de datos
    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (!passwordMatch) {
      // La contraseña no coincide
      return res.json({ success: false, message: 'Credenciales incorrectas. Por favor, verifica tus datos.' });
    }

    // Las credenciales son válidas, el usuario se ha autenticado con éxito
    return res.json({ success: true, message: 'Inicio de sesión exitoso.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente más tarde.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el Puerto ${PORT}`);
});
