'use strict';

const {DataTypes} = require("sequelize");
module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('comments', {

                id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
                userId: {type: DataTypes.INTEGER, allowNull: false,
                    references: {
                        model: 'users', // указываем имя таблицы с маленькой буквы
                        key: 'id'
                    }},
                postId: {type: DataTypes.INTEGER, allowNull: false,
                    references: {
                        model: 'posts', // указываем имя таблицы с маленькой буквы
                        key: 'id'
                    }}, // FK to Post
                content: {type: DataTypes.STRING, allowNull: true},
                likes: {type: DataTypes.INTEGER, allowNull: true},
                createdAt: {type: DataTypes.DATE, allowNull: true},
                updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });
    },


    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('comments');
    },
};

//npx sequelize-cli db:migrate