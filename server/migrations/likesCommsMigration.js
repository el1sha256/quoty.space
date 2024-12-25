'use strict';

const {DataTypes} = require("sequelize");
module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('likesComms', {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            commentId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('likesComms');
    },
};

//npx sequelize-cli db:migrate