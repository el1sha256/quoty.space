/*
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Category = sequelize.define("Category", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: true }
    });

    Category.associate = (models) => {
        Category.hasMany(models.Post, { foreignKey: 'categoryId' });
    };

    return Category;
};*/
