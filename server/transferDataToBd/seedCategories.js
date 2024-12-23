
const sequelize = require('../db');
const { Category } = require('../models');
const {DataTypes} = require("sequelize");
require('dotenv').config();

const categories1 = [
    {  name: 'all' },
    { name: 'sport' },
    { name: 'design' },
    {  name: 'programming' },
    {  name: 'nature' },
    {  name: 'chemistry' },
    {  name: 'Technology' },
    { name: 'Finance' },
];


(async () => {
    try {
        try {
            await sequelize.authenticate();
            console.log('Соединение с базой данных успешно!');
        } catch (error) {
            console.error('Невозможно подключиться к базе данных:', error);
        }

        console.log('Подключение к базе данных:', process.env.DB_NAME);
        console.log('Подключение к базе данных:', process.env.DB_HOST); //
        console.log('Подключение к базе данных:', process.env.DB_USER);

        await Category.bulkCreate(categories1, { validate: true });
        console.log('categories успешно добавлены!');
    } catch (error) {
        console.error('Ошибка при добавлении categories:', error);
    }
})();
// node ./transferDataToBd/seedCategories.js
//NODE_ENV=development node ./transferDataToBd/seedUsers.js
//npx sequelize-cli db:migrate