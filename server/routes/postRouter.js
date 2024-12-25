const Router = require('express')
const router = new Router()
const postController = require('../controllers/postController')


//http://localhost:4000/api/post/posts
router.get('/posts', postController.getAll); // Получение всех постов если фильтр не указан иначе с указаным фильтром
router.get('/user/:userId/posts', postController.getUsersPosts); // Посты пользователя
router.post('/posts/:id/like', postController.like); // Лайк поста
router.delete('/posts/:id/unlike', postController.unlike); // Убрать лайк
router.post('/posts/:id/save', postController.save); // Сохранить пост
router.delete('/posts/:id/unsave', postController.unsave); // Убрать сохранение

router.post('/create', postController.create); // Создать пост


router.delete('/:postId/delete', postController.delete); // Удалить пост


module.exports = router