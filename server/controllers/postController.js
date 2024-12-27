const ApiError = require('../error/ApiError');
const {Post, Category, Like, Saved} = require("../models");
const uuid = require("uuid");
const path = require("path");

class PostController {

    //http://localhost:4000/api/post/posts?category=sport
    //http://localhost:4000/api/post/posts?limit=2&page=1
    //http://localhost:4000/api/post/posts?category=sport&limit=2&page=1
    async getAll(req, res) { //get in category or all of them

        let {category, limit, page} = req.query;  // Получаем категорию из query-параметров запроса
        // Преобразуем limit и page в числа, если они существуют
        limit = parseInt(limit, 10) || 9; // Если limit не передан или некорректен, используем 9
        page = parseInt(page, 10) || 1;   // Если page не передан или некорректен, используем 1

        let offset = (page - 1) * limit; // Когда переходим по страничкам, это отступ
        console.log(limit, page, offset)

        try {
            if (category && category !== 'all') {
                const categoryExists = await Category.findOne({where: {name: category}});

                // Проверяем, существует ли такая категория в базе данных
                if (!categoryExists) {
                    return res.status(404).json({message: 'Категория не найдена.'});
                }

                // Ищем все посты, которые принадлежат выбранной категории
                const filteredPosts = await Post.findAndCountAll({ //посчитать сразу страницы для фронта //"count": 5, вот такое поле добавляется
                    where: {
                        categoryId: categoryExists.id, // в таблице Post есть поле categoryId
                    },
                    limit: limit, // Ограничиваем количество постов
                    offset: offset, // Устанавливаем отступ для пагинации
                });

                if (filteredPosts.length === 0) {
                    return res.status(404).json({message: 'Нет постов для данной категории.'});
                }

                return res.json(filteredPosts);  // Возвращаем отфильтрованные посты
            }
            // Если категория не указана или 'all', возвращаем все посты
            //http://localhost:4000/api/post/posts
            const allPosts = await Post.findAndCountAll({
                limit: limit, // Ограничиваем количество постов
                offset: offset, // Устанавливаем отступ для пагинации
        });
            return res.json(allPosts);

        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
            res.status(500).json({message: 'Ошибка сервера'});
        }
    }


    //http://localhost:4000/api/post/user/:userId/posts
    //http://localhost:4000/api/post/user/:userId/posts?limit=2&page=1
    async getUsersPosts(req, res) { //only users posts
        let {limit, page} = req.query;  // Получаем категорию из query-параметров запроса
        const userId = parseInt(req.params.userId)
        limit = parseInt(limit, 10) || 9; // Если limit не передан или некорректен, используем 9
        page = parseInt(page, 10) || 1;   // Если page не передан или некорректен, используем 1
        let offset = (page - 1) * limit; // Когда переходим по страничкам, это отступ

        try {
            if (!userId) {
                return res.status(404).json({message: 'Пользователь не найдена.'});
            }

            const userPosts = await Post.findAndCountAll({
                where: {userId},
                limit: limit, // Ограничиваем количество постов
                offset: offset, // Устанавливаем отступ для пагинации
            });

            if (userPosts.rows.length) {
                return res.json(userPosts);
            } else {
                return res.status(404).json({message: 'Посты пользователя не найдены'});
            }
        } catch (e) {
            console.error('Ошибка при получении постов пользователя:', e);
            return res.status(500).json({message: 'Ошибка сервера'});
        }

    }


    //http://localhost:4000/api/post/posts/:id/like
    async like(req, res) {
        const postId = parseInt(req.params.id, 10); //URL
        /*const userId = req.body.userId; //из тела запроса // { "userId": 42 } //идентификатор пользователя,*/
        const { id: userId } = req.user; // Получаем userId из данных пользователя в req.user

        if (!userId) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }
        console.log('postId:', postId, 'userId:', userId);
        try {
            const post = await Post.findByPk(postId);
            console.log('Post found:', post);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            //проверка лайкал или нет
            const existingLike = await Like.findOne({ where: { postId, userId } });
            console.log('Existing like:', existingLike);

            if (existingLike) {
                return res.status(400).json({ error: 'Post already liked by this user' });
            }

            await Like.create({ postId, userId }); //create a row
            console.log('Like created');

            post.likes += 1;
            await post.save();

            /*return res.status(200).json({ message: 'Post liked successfully', likes: post.likes });*/
            return res.status(200).json({ message: 'Post liked successfully', post });
        } catch (e) {
            console.error('Error liking post:', e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    //http://localhost:4000/api/post/posts/:id/unlike
    async unlike(req, res) {
        const postId = parseInt(req.params.id, 10);
        /*const userId = req.body.userId;*/
        const { id: userId } = req.user; // Получаем userId из данных пользователя в req.user

        if (!userId) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }

        try{
            const post = await Post.findByPk(postId);
            console.log('Post found:', post);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            const existingLike = await Like.findOne({ where: { postId, userId } });
            console.log('Existing like:', existingLike);

            if (!existingLike) {
                return res.status(400).json({ error: 'Like not found' });
            }
            // Удаляем лайк
            await existingLike.destroy();

            post.likes = Math.max(0, post.likes - 1); // Не позволяем лайкам стать отрицательными
            await post.save();

            return res.status(200).json({ message: 'Post unliked successfully', post });
        }catch (e) {
            console.error('Error liking post:', e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    //http://localhost:4000/api/post/posts/:id/save
    async save(req, res) {
        const postId = parseInt(req.params.id, 10);
       /* const userId = req.body.userId;*/
        const { id: userId } = req.user; // Получаем userId из данных пользователя в req.user

        if (!userId) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }

        try{
            const post = await Post.findByPk(postId);
            console.log('Post found:', post);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            const existingSave = await Saved.findOne({ where: { postId, userId } });
            console.log('Existing saving:', existingSave);

            if (existingSave) {
                return res.status(400).json({ error: 'Saving not found' });
            }

            await Saved.create({ postId, userId }); //create a row
            console.log('Saving created');

            post.savings += 1;
            await post.save();

            return res.status(200).json({ message: 'Post saved successfully', post });
        }catch (e) {
            console.error('Error saving post:', e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    //http://localhost:4000/api/post/posts/:id/unsave
    async unsave(req, res) {
        const postId = parseInt(req.params.id, 10);
        /*const userId = req.body.userId;*/
        const { id: userId } = req.user; // Получаем userId из данных пользователя в req.user

        if (!userId) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }

        try{
            const post = await Post.findByPk(postId);
            console.log('Post found:', post);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            const existingSaving = await Saved.findOne({ where: { postId, userId } });
            console.log('Existing like:', existingSaving);

            if (!existingSaving) {
                return res.status(400).json({ error: 'Saving not found' });
            }

            await existingSaving.destroy();

            post.savings = Math.max(0, post.savings - 1); // Не позволяем лайкам стать отрицательными
            await post.save();

            return res.status(200).json({ message: 'Post unsaved successfully', post });
        }catch (e) {
            console.error('Error saving post:', e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    //http://localhost:4000/api/post/create
    //{
    //     "postContent": {
    //         "postText": "This is a test post",
    //         "category": 4
    //     },
    //     "userId": 1
    //     "img": photo
    // }

    async create(req, res) {
        const { postContent} = req.body;
        const { id: userId } = req.user; // Получаем userId из данных пользователя в req.user

        if (!userId) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }

        const {img} = req.files //ability to add pics
        let fileName = uuid.v4() + ".jpg" //unique IDshka
        await img.mv(path.resolve(__dirname, '..', 'static', fileName)) //переместить файл с заданным именем в нужную папку

        try{
            const parsedPostContent = JSON.parse(postContent); // Парсим JSON из строки чтобы через постман через форм-дата все окей было

            if (!parsedPostContent || !parsedPostContent.postText || !parsedPostContent.category || !userId) {
                console.log(parsedPostContent, userId)
                return res.status(400).json({ message: "Content, category, and userId are required server is yebische" });
            }

            const newPost = await Post.create({
                userId: userId,
                content: parsedPostContent.postText,
                likes: 0,
                savings: 0,
                categoryId: parsedPostContent.category,
                createdAt: new Date(),
                updatedAt: new Date(),
                img:fileName,
            });
            res.status(201).json(newPost); //one post

        }catch (e) {
            console.error("Error creating post:", e);
            res.status(500).json({ message: "Failed to create post", e});
        }
    }

    //http://localhost:4000/api/post/:postId/delete
    async delete(req, res) {
        const postId = parseInt(req.params.postId, 10);
       /* const userId = req.body.userId; //*/
        const userId = req.user.id; //from token

        if (!userId) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }

        try {
            const post = await Post.findByPk(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            // Check if the post belongs to the user
            if (post.userId !== userId) {
                return res.status(403).json({ message: 'You are not authorized to delete this post' });
            }

            // Delete the post
            await post.destroy();
            res.json({ message: 'Post deleted successfully' });
        } catch (e) {
            console.error('Error deleting post:', e);
            res.status(500).json({ error: 'An error occurred while deleting the post' });
        }
    }
}

module.exports = new PostController()