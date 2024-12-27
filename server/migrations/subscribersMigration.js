'use strict';

const {DataTypes} = require("sequelize");
module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('subscriptions', {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},

            userId: {type: DataTypes.INTEGER, allowNull: false, // это ID пользователя, на которого подписываются.
                references: {
                    model: 'users', // Ссылаемся на таблицу пользователей
                    key: 'id'
                }},

            subscriberId: { //это ID пользователя, который подписывается.
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Ссылаемся на таблицу пользователей
                    key: 'id'
                }
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('subscriptions');
    },
};

//npx sequelize-cli db:migrate