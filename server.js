require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();
const PORT = 3000;


// Configuración de CORS
app.use(cors({
  origin: 'https://navdex.vercel.app', // Cambia esto al origen de tu frontend
  credentials: true,
  methods: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  allowedHeaders: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
