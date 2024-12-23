const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Comment = sequelize.define("Comment", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        postId: { type: DataTypes.INTEGER, allowNull: false },
        content: { type: DataTypes.STRING, allowNull: true },
        likes: { type: DataTypes.INTEGER, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: true }
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.User, { foreignKey: 'userId' });
        Comment.belongsTo(models.Post, { foreignKey: 'postId' });
    };

    return Comment;
};