const sequelize = require("../db");
const {DataTypes} = require("sequelize");


module.exports = (sequelize) => {
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
            }, // Хранение пути к аватарке
           /* subscriptions: {
                type: DataTypes.JSON,
                allowNull: true
            }, // Хранение массива подписок
            subscribers: {
                type: DataTypes.JSON,
                allowNull: true
            },*/
            receivedLikes: {
                type: DataTypes.INTEGER,
                allowNull: true
            }, //number of all likes
            placedLikes: {
                type: DataTypes.JSON,
                allowNull: true
            },//array of Ids posts
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            },

            role: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "user", // По умолчанию обычный пользователь
                validate: {
                    isIn: [["user", "ADMIN", "superuser"]] // Доступные роли
                }
            },
        },

        {
            tableName: 'users', // Убедитесь, что это имя таблицы в базе данных
            timestamps: true,
            /*underscored: true // Используйте для сопоставления с именами столбцов, если это необходимо*/
            underscored: false,  // Чтобы Sequelize использовал camelCase вместо snake_case
        })

    const Post = sequelize.define("Post", {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            userId: {
                type: DataTypes.INTEGER, allowNull: false, references: {
                    model: 'users', // указываем имя таблицы с маленькой буквы
                    key: 'id'
                }
            },
            content: {type: DataTypes.STRING, allowNull: true},
            likes: {type: DataTypes.INTEGER, allowNull: true},
            savings: {type: DataTypes.INTEGER, allowNull: true},
            categoryId: {type: DataTypes.INTEGER, allowNull: true, references: {model: 'categories', key: 'id'}},

            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            img: {
                type: DataTypes.STRING,
                allowNull: true
            },
        },
        {
            tableName: 'posts', // Таблица называется 'posts'
            timestamps: true,
        })


    const Comment = sequelize.define("Comment", {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            userId: {
                type: DataTypes.INTEGER, allowNull: false,
                references: {
                    model: 'users', // указываем имя таблицы с маленькой буквы
                    key: 'id'
                }
            },
            postId: {
                type: DataTypes.INTEGER, allowNull: false,
                references: {
                    model: 'posts', // указываем имя таблицы с маленькой буквы
                    key: 'id'
                }
            }, // FK to Post
            content: {type: DataTypes.STRING, allowNull: true},
            likes: {type: DataTypes.INTEGER, allowNull: true},
            createdAt: {type: DataTypes.DATE, allowNull: true},
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'comments', // Таблица называется 'posts'
            timestamps: true,
        })

    const Category = sequelize.define("Category", {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: DataTypes.STRING, allowNull: true},
        },
        {
            tableName: 'categories',
            timestamps: true,
        })


    const Like = sequelize.define("Like", { //likes for posts
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            userId: {type: DataTypes.INTEGER, allowNull: false},
            postId: {type: DataTypes.INTEGER, allowNull: false},

            createdAt: {type: DataTypes.DATE, allowNull: true},
            updatedAt: {type: DataTypes.DATE, allowNull: false}
        },
        {
            tableName: 'likes',
            timestamps: true,
        })

    const LikeComms = sequelize.define("LikeComms", { //likes for comms
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            userId: {type: DataTypes.INTEGER, allowNull: false},
            commentId: {type: DataTypes.INTEGER, allowNull: false},
            createdAt: {type: DataTypes.DATE, allowNull: true},
            updatedAt: {type: DataTypes.DATE, allowNull: false}
        },
        {
            tableName: 'likesComms',
            timestamps: true,
    })

    const Saved = sequelize.define("Saved", { //likes for posts
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            userId: {type: DataTypes.INTEGER, allowNull: false},
            postId: {type: DataTypes.INTEGER, allowNull: false},
            createdAt: {type: DataTypes.DATE, allowNull: true},
            updatedAt: {type: DataTypes.DATE, allowNull: false}
        },
        {
            tableName: 'saved',
            timestamps: true,
        })


    const Subscription = sequelize.define("Subscription", {
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
    }, {
        tableName: 'subscriptions', // Имя таблицы в базе данных
        timestamps: false, // Подписки не требуют полей времени
        underscored: false,
    })


    User.hasMany(Post, {foreignKey: 'userId'})
    User.hasMany(Comment, {foreignKey: 'userId'})
    Post.belongsTo(User, {foreignKey: 'userId'})

    Post.hasMany(Comment, {foreignKey: 'postId'})
    Comment.belongsTo(Post, {foreignKey: 'postId'})

    Comment.belongsTo(User, {foreignKey: 'userId'}); // Comments also belong to Users

    Post.belongsTo(Category, {foreignKey: 'categoryId'}); // Each post belongs to one category
    Category.hasMany(Post, {foreignKey: 'categoryId'}); // One category has many posts

    Post.hasMany(Like, {foreignKey: 'postId'});
    Like.belongsTo(Post, {foreignKey: 'postId'});

    Post.hasMany(Saved, {foreignKey: 'postId'});
    Saved.belongsTo(Post, {foreignKey: 'postId'});

    Comment.hasMany(LikeComms, {foreignKey: 'commentId'});
    LikeComms.belongsTo(Comment, {foreignKey: 'commentId'});


    User.hasMany(Subscription, { foreignKey: 'userId', as: 'userSubscriptions' }); //подписок //на которого
    //as: 'subscriptions' — это просто название, которое мы используем, чтобы обращаться к подпискам.
    //const user = await User.findByPk(1, { include: ['subscriptions'] });
    User.hasMany(Subscription, { foreignKey: 'subscriberId', as: 'userSubscribers' }); //кто подписан

    Subscription.belongsTo(User, { foreignKey: 'userId', as: 'subscribedUser' });//на кого она оформлена:
    //const subscription = await Subscription.findByPk(1, { include: ['user'] });
    Subscription.belongsTo(User, { foreignKey: 'subscriberId', as: 'subscribingUser' });//кто подписался на пользователя:
    //const subscription = await Subscription.findByPk(1, { include: ['subscriber'] });

    return {User, Post, Comment, Category, Like, Saved, LikeComms, Subscription};
};


/*module.exports = {
    User, Post, Comment, Category
}
module.exports = User;*/

