const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;

if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Импортируйте модели из одного файла
const models = require('./models')(sequelize);

Object.keys(models).forEach((modelName) => {
    db[modelName] = models[modelName];
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
