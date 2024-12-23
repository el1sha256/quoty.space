const Router = require('express')
const router = new Router()
const postController = require('../controllers/postController')



router.get('/posts', postController.getAll); // Получение всех постов
router.get('/user/:userId/posts', postController.getUsersPosts); // Посты пользователя
router.get('/posts', postController.getCategoriesPosts); // Посты s filtrom
router.post('/posts/:id/like', postController.like); // Лайк поста
router.delete('/posts/:id/unlike', postController.unlike); // Убрать лайк
router.post('/posts/:id/save', postController.save); // Сохранить пост
/*router.delete('/:id/unsave', authenticateToken, PostController.unsave); // Убрать сохранение*/
router.delete('/posts/:id/unsave', postController.unsave); // Убрать сохранение
router.post('/posts', postController.create); // Создать пост
router.delete('/posts/:postId', postController.delete); // Удалить пост


module.exports = router