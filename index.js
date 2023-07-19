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

  const hashedPassword = await bcrypt.hash(password, 10);

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

app.get('/clientes', async (req, res) => {
  const personas = await Usuario.find({}, {
    "nombre": 1,
    "apellido": 1,
    "email": 1,
    "password": 1,
    "timestamp": 1
  });

  console.log(personas);

  res.json({
    personas
  });
});

app.delete('/clientes/:id', async (req, res) => {
  const id = req.params.id;

  console.log(id);

  try {
    const deleteUser = await Usuario.findByIdAndDelete(id);
    console.log(deleteUser);
    if (deleteUser) {
      console.log('Cliente Eliminado');
      return res.status(200).send();
    } else {
      return res.status(404).send();
    }
  } catch (error) {
    console.log(error);
  }
});

app.put('/clientes/:id', async (req, res) => {
  const id = req.params.id;

  const data = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    password: req.body.password,
  };

  console.log(data);
  console.log(id);

  try {
    const updateUser = await Usuario.findByIdAndUpdate(id, data);
    console.log(updateUser);
    if (updateUser) {
      console.log('Cliente Actualizado');
      return res.status(200).send();
    } else {
      return res.status(404).send();
    }
  } catch (error) {
    console.log(error);
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return res.json({ success: true, user });
    } else {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el Puerto ${PORT}`);
});