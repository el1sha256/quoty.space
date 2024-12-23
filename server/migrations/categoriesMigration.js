'use strict';

const {DataTypes} = require("sequelize");
module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('categories', {


                id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
                name: {type: DataTypes.STRING, allowNull: true},

        });
    },


    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('categories');
    },
};

//npx sequelize-cli db:migrate