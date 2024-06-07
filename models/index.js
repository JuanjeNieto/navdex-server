const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();  
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'sqlite',
    storage: './database.sqlite', 
    logging: false,
});

module.exports = sequelize;