const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./models');  
const path = require('path');
const userRoutes = require('./routes/user');


const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}).catch(err => console.log(err));
