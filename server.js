require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();
const PORT = 3000;


// Configuración de CORS
app.use(cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
