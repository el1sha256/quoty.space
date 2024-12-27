const Router = require('express')
const router = new Router()
const postController = require('../controllers/postController')
const authMiddleware = require("../middleware/authMiddleware");


//http://localhost:4000/api/post/posts

/**
 * @swagger
 * /api/post/posts:
 *   get:
 *     summary: Получить все посты или посты по фильтру категории
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Фильтр по категории (например, "news")
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 9
 *         description: Количество постов на странице
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *     responses:
 *       200:
 *         description: Возвращает список постов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Некорректные параметры запроса
 *       404:
 *         description: Посты не найдены
 */
router.get('/posts', postController.getAll); // Получение всех постов если фильтр не указан иначе с указаным фильтром

/**
 * @swagger
 * /api/post/user/{userId}/posts:
 *   get:
 *     summary: Получить посты пользователя
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 9
 *         description: Количество постов на странице
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *     responses:
 *       200:
 *         description: Возвращает список постов пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: Посты не найдены для указанного пользователя
 */
router.get('/user/:userId/posts',  postController.getUsersPosts); // Посты пользователя


/**
 * @swagger
 * /api/post/posts/{id}/like:
 *   post:
 *     summary: Лайкнуть пост
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID поста
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Пост успешно лайкнут
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Пост уже был лайкнут этим пользователем
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Пост не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/posts/:id/like',authMiddleware, postController.like); // Лайк поста

/**
 * @swagger
 * /api/post/posts/{id}/unlike:
 *   delete:
 *     summary: Убрать лайк с поста
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID поста
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Лайк успешно удалён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Лайк не найден
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Пост не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete('/posts/:id/unlike',authMiddleware, postController.unlike); // Убрать лайк

/**
 * @swagger
 * /api/post/posts/{id}/save:
 *   post:
 *     summary: Сохранить пост
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID поста
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Пост успешно сохранён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Пост уже был сохранён этим пользователем
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Пост не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/posts/:id/save',authMiddleware, postController.save); // Сохранить пост

/**
* @swagger
* /api/post/posts/{id}/unsave:
*   delete:
*     summary: Убрать сохранение с поста
*     tags: [Post]
*     security:
*       - bearerAuth: []
*     parameters:
*       - name: id
*         in: path
*         description: ID поста
*         required: true
*         schema:
*           type: integer
*     responses:
*       200:
*         description: Пост успешно убран из сохранённых
*         content:
*           application/json:
*             schema:
    *               type: object
*               properties:
*                 message:
    *                   type: string
*                 post:
*                   $ref: '#/components/schemas/Post'
*       400:
*         description: Пост не был сохранён
*       401:
*         description: Пользователь не авторизован
*       404:
*         description: Пост не найден
*       500:
*         description: Внутренняя ошибка сервера
*/
router.delete('/posts/:id/unsave',authMiddleware, postController.unsave); // Убрать сохранение


/**
 * @swagger
 * /api/post/create:
 *   post:
 *     summary: Создать новый пост
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postContent:
 *                 type: object
 *                 properties:
 *                   postText:
 *                     type: string
 *                   category:
 *                     type: integer
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Пост успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Проблема с созданием поста (недостаточно данных)
 *       401:
 *         description: Пользователь не авторизован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/create',authMiddleware, postController.create); // Создать пост




/**
 * @swagger
 * /api/post/{postId}/delete:
 *   delete:
 *     summary: Удалить пост
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID поста
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Пост успешно удалён
 *       400:
 *         description: Проблема с удалением поста
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Пользователь не имеет прав на удаление поста
 *       404:
 *         description: Пост не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete('/:postId/delete',authMiddleware, postController.delete); // Удалить пост


module.exports = router