const Router = require('express')
const router = new Router()
const commentController = require("../controllers/commentController");




/**
 * @swagger
 * /api/comment/{postId}/comments:
 *   get:
 *     summary: Получение комментариев для конкретного поста с пагинацией
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Идентификатор поста
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 9
 *         description: Ограничение количества комментариев на страницу (по умолчанию 9)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы (по умолчанию 1)
 *     responses:
 *       200:
 *         description: Список комментариев для поста
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                       likes:
 *                         type: integer
 *       404:
 *         description: Пост не найден или нет комментариев для данного поста
 *       500:
 *         description: Ошибка сервера
 */
router.get('/:postId/comments', commentController.getPostComments); // Комментарии к опред посту

/**
 * @swagger
 * /api/comment/{id}/create:
 *   post:
 *     summary: Создание комментария для поста
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID поста
 *         required: true
 *         schema:
 *           type: integer
 *       - name: content
 *         in: body
 *         description: Содержимое комментария
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Комментарий успешно создан
 *       400:
 *         description: Отсутствуют обязательные данные (content или userId)
 *       401:
 *         description: Ошибка аутентификации (неверный или отсутствующий токен)
 *       404:
 *         description: Пост не найден
 *       500:
 *         description: Ошибка при добавлении комментария
 */
router.post('/:id/create', commentController.create); // Создать //id of the post itself


/**
 * @swagger
 * /api/comment/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Удаление комментария
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID поста
 *         required: true
 *         schema:
 *           type: integer
 *       - name: commentId
 *         in: path
 *         description: ID комментария
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Комментарий успешно удален
 *       400:
 *         description: Невозможность удалить комментарий (например, комментарий не существует)
 *       401:
 *         description: Ошибка аутентификации (неверный или отсутствующий токен)
 *       403:
 *         description: Доступ запрещен (пользователь может удалять только свои комментарии)
 *       404:
 *         description: Пост или комментарий не найдены
 *       500:
 *         description: Ошибка при удалении комментария
 */
router.delete('/:postId/comments/:commentId', commentController.delete); // Удалить


/**
 * @swagger
 * /api/comment/{postId}/comments/{commentId}/like:
 *   post:
 *     summary: Лайк комментария
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID поста
 *         required: true
 *         schema:
 *           type: integer
 *       - name: commentId
 *         in: path
 *         description: ID комментария
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Лайк успешно поставлен
 *       400:
 *         description: Комментарий уже был оценен этим пользователем
 *       401:
 *         description: Ошибка аутентификации (неверный или отсутствующий токен)
 *       404:
 *         description: Пост или комментарий не найдены
 *       500:
 *         description: Ошибка при добавлении лайка
 */
router.post('/:postId/comments/:commentId/like', commentController.like); // лайкнуть //НЕ СДЕЛАНО CLIENT

/**
 * @swagger
 * /api/comment/{postId}/comments/{commentId}/like:
 *   delete:
 *     summary: Удаление лайка комментария
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID поста
 *         required: true
 *         schema:
 *           type: integer
 *       - name: commentId
 *         in: path
 *         description: ID комментария
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Лайк успешно удален
 *       400:
 *         description: Лайк не найден (не был поставлен пользователем)
 *       401:
 *         description: Ошибка аутентификации (неверный или отсутствующий токен)
 *       404:
 *         description: Пост или комментарий не найдены
 *       500:
 *         description: Ошибка при удалении лайка
 */
router.delete('/:postId/comments/:commentId/unlike', commentController.unlike); // лайкнуть //НЕ СДЕЛАНО CLIENT


module.exports = router