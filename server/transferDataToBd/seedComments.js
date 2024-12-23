const sequelize = require('../db');
const { Comment } = require('../models'); //
const {DataTypes} = require("sequelize");
require('dotenv').config();

const comments1 = [
    /*{ id: 1, postId: 1, userId: 1, content: "Great post!", createdAt: new Date(), updatedAt: new Date(), username: "UserOne" },
    { id: 2, postId: 1, userId: 2, content: "Thanks for sharing!", createdAt: new Date(), updatedAt: new Date(), username: "UserTwo" },
    { id: 3, postId: 2, userId: 1, content: "Nice design!", createdAt: new Date(), updatedAt: new Date(), username: "UserOne" },*/
    {postId: 1, userId: 1, content: "Great post!", createdAt: new Date(), updatedAt: new Date() },
    { postId: 1, userId: 2, content: "Thanks for sharing!", createdAt: new Date(), updatedAt: new Date()},
    { postId: 2, userId: 1, content: "Nice design!", createdAt: new Date(), updatedAt: new Date() },
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

        await Comment.bulkCreate(comments1, { validate: true });
        console.log('Posts успешно добавлены!');
    } catch (error) {
        console.error('Ошибка при добавлении posts:', error);
    }
})();
// node ./transferDataToBd/seedComments.js
//NODE_ENV=development node ./transferDataToBd/seedComments.js
//npx sequelize-cli db:migrate