const Router = require('express')
const router = new Router()
const subscribersController = require("../controllers/subscribersController");



router.post('/users/:id/subscriptions', subscribersController.getSubscriptions); //подписки
router.delete('/users/:id/subscribers', subscribersController.getSubscribers); //подписчики



module.exports = router