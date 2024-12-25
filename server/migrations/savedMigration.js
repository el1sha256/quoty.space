'use strict';

const {DataTypes} = require("sequelize");
module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('saved', {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            userId: { type: DataTypes.INTEGER, allowNull: false },
            postId: { type: DataTypes.INTEGER, allowNull: false },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('saved');
    },
};

//npx sequelize-cli db:migrate