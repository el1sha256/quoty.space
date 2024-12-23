/*
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Post = sequelize.define("Post", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        content: { type: DataTypes.STRING, allowNull: true },
        likes: { type: DataTypes.INTEGER, allowNull: true },
        savings: { type: DataTypes.INTEGER, allowNull: true },
        categoryData: { type: DataTypes.STRING, allowNull: true },
        commentsData: { type: DataTypes.JSON, allowNull: true }
    });

    Post.associate = (models) => {
        Post.belongsTo(models.User, { foreignKey: 'userId' });
        Post.hasMany(models.Comment, { foreignKey: 'postId' });
        Post.belongsTo(models.Category, { foreignKey: 'categoryId' });
    };

    return Post;
};*/
