const sequelize = require('../db');
const { Post } = require('../models');
const { User } = require('../models'); //
const {DataTypes} = require("sequelize");
require('dotenv').config();

const posts1 = [
    //не указывать id вручную при добавлении данных, если вы хотите, чтобы база данных сама назначала уникальные значения.
    { userId: 1, content: 'Первый пост пользователя 1', likes: 0, savings: 0, categoryId: 1,  createdAt: new Date(), updatedAt: new Date() },
    { userId: 1, content: 'Второй пост пользователя 1', likes: 0, savings: 0, categoryId: 2,  createdAt: new Date(), updatedAt: new Date() },
    { userId: 2, content: 'Первый пост пользователя 2', likes: 0, savings: 0, categoryId: 3,  createdAt: new Date(), updatedAt: new Date() },
    { userId: 3, content: 'Первый пост пользователя 3', likes: 0, savings: 0, categoryId: 3,  createdAt: new Date(), updatedAt: new Date() },
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

        await Post.bulkCreate(posts1, { validate: true });
        console.log('Posts успешно добавлены!');
    } catch (error) {
        console.error('Ошибка при добавлении posts:', error);
    }
})();
// node ./transferDataToBd/seedPosts.js
//NODE_ENV=development node ./transferDataToBd/seedUsers.js
//npx sequelize-cli db:migrate