'use strict';

const {DataTypes} = require("sequelize");
module.exports = {
    /*up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('posts', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId:{
                type: Sequelize.INTEGER,
                 allowNull: false,
                references: {
                    model: 'users', // Явно указываем имя таблицы в нижнем регистре
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            content:{
                type: Sequelize.STRING,
                allowNull: true,
            },
            likes:{
                type: Sequelize.INTEGER,
                allowNull: true
            },
            savings:{
                type: Sequelize.INTEGER,
                allowNull: true
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'categories',
                    key: 'id'}},
            commentsData:{ //comments
                type: DataTypes.JSON,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });
    },*/

    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('posts', 'categoryId', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'id',
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('posts');
    },
};

//npx sequelize-cli db:migrate