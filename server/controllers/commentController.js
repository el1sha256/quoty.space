const ApiError = require('../error/ApiError');
const {Post, Comment, LikeComms} = require("../models");
const uuid = require("uuid");
const path = require("path");



class CommentController {

    //http://localhost:4000/api/comment/:postId/comments
    //http://localhost:4000/api/comment/:postId/comments?limit=2&page=1
    async getPostComments(req, res) {
        let {limit, page} = req.query;  // Получаем из query-параметров запроса
        limit = parseInt(limit, 10) || 9; // Если limit не передан или некорректен, используем 9
        page = parseInt(page, 10) || 1;   // Если page не передан или некорректен, используем 1

        let offset = (page - 1) * limit; // Когда переходим по страничкам, это отступ

        const postId = parseInt(req.params.postId, 10);
        try {
            // существует ли пост?
            const post = await Post.findOne({ where: { id: postId } });
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            // все комментарии, связанные с постом
            const comments = await Comment.findAndCountAll({
                where: { postId: postId },
                order: [['createdAt', 'ASC']], // сортировка по времени создания //
                    limit: limit, // Ограничиваем количество постов
                    offset: offset, // Устанавливаем отступ для пагинации
            });

            if (comments.rows.length === 0) {
                return res.status(404).json({message: 'Нет коммов для данного поста.'});
            }

            res.json({ comments });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching comments' });
        }
    }


    //http://localhost:4000/api/comment/:id/create
    //{ "userId": 1, "content": "This is a comment" }
    async create(req, res) {
        const postId = parseInt(req.params.id, 10); //Url
        /*const { userId, content } = req.body; //body*/
        const { content } = req.body; //body
        const userId = req.user.id; //from token

        if (!content || !userId) {
            return res.status(400).json({ error: 'User ID and content are required' });
        }

        try {
            // Проверяем, существует ли пост
            const post = await Post.findByPk(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            // Создаем новый комментарий
            const newComment = await Comment.create({
                postId: postId,
                userId: userId, //synchronize with front
                content: content, //synchronize with front
                likes: 0, //synchronize with front
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            res.status(201).json(newComment);
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ error: 'An error occurred while adding the comment' });
        }
    }

    //http://localhost:4000/api/comment/:postId/comments/:commentId
    async delete(req, res) {
        const postId = parseInt(req.params.postId, 10);
        const commentId = parseInt(req.params.commentId, 10);
        const userId = req.user.id; //from token
        if (!userId) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }
        try{
            // существует ли пост
            const post = await Post.findOne({ where: { id: postId } });
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            //comm
            const comment = await Comment.findOne({ where: { id: commentId, postId: postId } });
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }
            await Comment.destroy({ where: { id: commentId } });
            res.json({ message: 'Comment deleted' });
        }catch (e){
            console.error(e);
            res.status(500).json({ error: 'An error occurred while deleting the comment' });
        }
    }

    //http://localhost:4000/api/comment/:postId/comments/:commentId/like
    async like(req, res) {
        const postId = parseInt(req.params.postId, 10); // ID поста из URL
        const commentId = parseInt(req.params.commentId, 10); // ID комментария из URL
        /*const userId = req.body.userId; // Идентификатор пользователя из тела запроса*/
        const userId = req.user.id; //from token
        console.log('postId:', postId, 'commentId:', commentId, 'userId:', userId);

        try {
            // Найдем пост по ID
            const post = await Post.findByPk(postId);
            console.log('Post found:', post);

            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            // Найдем комментарий в посте
            const comment = await Comment.findByPk(commentId); // Используйте findByPk для поиска комментария
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            // Проверка, поставил ли пользователь лайк
            const existingLike = await LikeComms.findOne({ where: { commentId, userId } });
            console.log('Existing like:', existingLike);

            if (existingLike) {
                return res.status(400).json({ error: 'Comment already liked by this user' });
            }

            // Если лайка нет, создаем новый
            await LikeComms.create({ commentId, userId });
            console.log('Like created');

            // Увеличиваем количество лайков у комментария
            comment.likes += 1;
            await comment.save(); // Сохраняем комментарий с обновленным количеством лайков

            return res.status(200).json({ message: 'Comment liked successfully', post });
        } catch (e) {
            console.error('Error liking comment:', e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async unlike(req, res) {
        const postId = parseInt(req.params.postId, 10); // ID поста из URL
        const commentId = parseInt(req.params.commentId, 10); // ID комментария из URL
        /*const userId = req.body.userId; // Идентификатор пользователя из тела запроса*/
        const userId = req.user.id; //from token
        console.log('postId:', postId, 'commentId:', commentId, 'userId:', userId);

        try {
            // Найдем пост по ID
            const post = await Post.findByPk(postId);
            console.log('Post found:', post);

            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            // Найдем комментарий по ID
            const comment = await Comment.findByPk(commentId);
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            // Проверка, поставил ли пользователь лайк
            const existingLike = await LikeComms.findOne({ where: { commentId, userId } });
            console.log('Existing like:', existingLike);

            if (!existingLike) {
                return res.status(400).json({ error: 'Comment has not been liked by this user' });
            }

            // Если лайк существует, удаляем его
            await existingLike.destroy();
            console.log('Like removed');

            // Уменьшаем количество лайков у комментария
            comment.likes -= 1;
            await comment.save(); // Сохраняем комментарий с обновленным количеством лайков

            return res.status(200).json({ message: 'Like removed successfully', post });
        } catch (e) {
            console.error('Error unliking comment:', e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }



}

module.exports = new CommentController()