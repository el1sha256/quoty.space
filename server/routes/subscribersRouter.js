const Router = require('express')
const router = new Router()
const subscribersController = require("../controllers/subscribersController");
const authMiddleware = require('../middleware/authMiddleware')




// Подписаться на пользователя
/**
 * @swagger
 * /api/subscribers/subscribe:
 *   post:
 *     summary: Подписаться на пользователя
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetUserId:
 *                 type: integer
 *                 description: ID пользователя, на которого нужно подписаться
 *     responses:
 *       200:
 *         description: Подписка успешно оформлена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Ошибка, если попытка подписаться на самого себя или если уже существует подписка
 *       401:
 *         description: Пользователь не авторизован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/subscribe', authMiddleware, subscribersController.subscribe);



// Отписаться от пользователя
/**
 * @swagger
 * /api/subscribers/unsubscribe:
 *   post:
 *     summary: Отписаться от пользователя
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetUserId:
 *                 type: integer
 *                 description: ID пользователя, от которого нужно отписаться
 *     responses:
 *       200:
 *         description: Отписка успешно оформлена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Ошибка, если не найдено подписки или если пользователь не подписан
 *       401:
 *         description: Пользователь не авторизован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/unsubscribe', authMiddleware, subscribersController.unsubscribe);



// Получить список подписок/подписчиков пользователя
/**
 * @swagger
 * /api/subscribers/subscriptions:
 *   get:
 *     summary: Получить подписки или подписчиков
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: targetUserId
 *         in: query
 *         description: ID пользователя, чьи подписки или подписчики нужно получить (если не указан, используются данные текущего пользователя)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: type
 *         in: query
 *         description: Тип запроса ('subscriptions' для подписок, 'subscribers' для подписчиков)
 *         required: true
 *         schema:
 *           type: string
 *           enum: [subscriptions, subscribers]
 *     responses:
 *       200:
 *         description: Список подписок или подписчиков
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                   subscriberId:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Ошибка, если указан неверный тип запроса или отсутствует параметр `type`
 *       401:
 *         description: Пользователь не авторизован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/subscriptions', authMiddleware, subscribersController.getSubscriptions);




module.exports = router