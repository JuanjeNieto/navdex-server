require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT;


// Configuración de CORS
app.use(cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
