
/*
const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        subscriptions: {
            type: DataTypes.JSON,
            allowNull: true
        },
        subscribers: {
            type: DataTypes.JSON,
            allowNull: true
        },
        receivedLikes: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        placedLikes: {
            type: DataTypes.JSON,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'users',
        timestamps: true,
        underscored: true
    });

    User.associate = (models) => {
        User.hasMany(models.Post, { foreignKey: 'userId' });
        User.hasMany(models.Comment, { foreignKey: 'userId' });
    };
    return User;
};*/
