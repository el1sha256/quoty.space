/*const {User} = require('../models');*/
const sequelize = require('../db');
const { User } = require('../models');
const {DataTypes} = require("sequelize");
require('dotenv').config();

const users1 = [
    /*{ id: 1, email: 'user@example.com', password: 'password123', userName: 'agent 001', description: 'se u', avatar: null, subscriptions: [1], subscribers: [2, 3, 4, 5], receivedLikes: 1, placedLikes: [], createdAt: new Date(),
        updatedAt: new Date(), },*/
    { id: 2, email: 'user@example2.com', password: 'password123', userName: 'agent 002', description: 'sdc', avatar: null, subscriptions: [1], subscribers: [2, 3, 4, 5], receivedLikes: 2, placedLikes: [], createdAt: new Date(),
        updatedAt: new Date(), },
    { id: 3, email: 'user@example3.com', password: 'password123', userName: 'agent 003', description: 'jhgfd', avatar: null, subscriptions: [1, 2], subscribers: [1, 2], receivedLikes: 3, placedLikes: [], createdAt: new Date(),
        updatedAt: new Date(), },
    { id: 4, email: 'user@example4.com', password: 'password123', userName: 'agent 004', description: 'poop', avatar: null, subscriptions: [1, 2, 3], subscribers: [1, 2, 3], receivedLikes: 4, placedLikes: [], createdAt: new Date(),
        updatedAt: new Date(), },
    { id: 5, email: 'user@example5.com', password: 'password123', userName: 'agent 005', description: 'xzxz x', avatar: null, subscriptions: [1, 2, 3, 4], subscribers: [1, 2, 3, 4], receivedLikes: 5, placedLikes: [], createdAt: new Date(),
        updatedAt: new Date(), },
];

(async () => {
    try {
        /*// Синхронизация модели (если таблица еще не создана)
        await User.sync(); // Удалите это, если таблица уже существует и настроена*/



        try {
            await sequelize.authenticate();
            console.log('Соединение с базой данных успешно!');
        } catch (error) {
            console.error('Невозможно подключиться к базе данных:', error);
        }

        console.log('Подключение к базе данных:', process.env.DB_NAME);
        console.log('Подключение к базе данных:', process.env.DB_HOST); //
        console.log('Подключение к базе данных:', process.env.DB_USER);

        /*await User.destroy({ where: {} }); // Удаляет все записи*/
       /* await User.destroy({ where: {}, truncate: true }); //и сбрасывает автонумерацию*/
       /* await sequelize.query('TRUNCATE "users" CASCADE');*/
        // Добавление пользователей в базу данных
       /* await User.bulkCreate(users, { validate: true });*/
        await User.bulkCreate(users1, { validate: true });
        console.log('Пользователи успешно добавлены!');
    } catch (error) {
        console.error('Ошибка при добавлении пользователей:', error);
    }
})();
// node ./transferDataToBd/seedUsers.js
//NODE_ENV=development node ./transferDataToBd/seedUsers.js
//npx sequelize-cli db:migrate