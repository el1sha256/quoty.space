const Router = require('express')
const router = new Router()
const subscribersController = require("../controllers/subscribersController");
const authMiddleware = require('../middleware/authMiddleware')

/*
//subscribers
router.post('/:id/subscriptions', subscribersController.getSubscriptions); //подписки
router.delete('/:id/subscribers', subscribersController.getSubscribers); //подписчики
*/


// Подписаться на пользователя
router.post('/subscribe', authMiddleware, subscribersController.subscribe);

// Отписаться от пользователя
router.post('/unsubscribe', authMiddleware, subscribersController.unsubscribe);

// Получить список подписок пользователя
router.get('/subscriptions', authMiddleware, subscribersController.getSubscriptions);

// Получить список подписчиков пользователя
/*router.get('/subscribers', authMiddleware, subscribersController.getSubscribers);*/



module.exports = router