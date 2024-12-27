const ApiError = require('../error/ApiError');
const {Subscription, User} = require('../models');

class SubscribersController {

    //{
    //      "targetUserId": 3 //на кого
    // }
    //Authorization Bearer eyJhbGciOi... //чел с чьего акка мы подписываемся
    //http://localhost:4000/api/subscribers/subscribe
    async subscribe(req, res, next) {
        const { id } = req.user;  // Получаем ID текущего пользователя
        const { targetUserId } = req.body; // Получаем ID пользователя, на которого подписываются

        if (id === targetUserId) {
            return res.status(400).json({ message: 'Нельзя подписаться на самого себя' });
        }
        // Проверяем, существует ли уже подписка
        const existingSubscription = await Subscription.findOne({
            where: {
                userId: targetUserId,
                subscriberId: id
            }
        });

        if (existingSubscription) {
            return res.status(400).json({ message: 'Вы уже подписаны на этого пользователя' });
        }

        try {
            const subscription = await Subscription.create({ userId: targetUserId, subscriberId: id });
            return res.json({ message: `Вы подписались на пользователя с ID ${targetUserId}` });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }




    //http://localhost:4000/api/subscribers/unsubscribe
    async unsubscribe(req, res,next) {
        const { id } = req.user;
        const { targetUserId } = req.body;

        try {
            const subscription = await Subscription.findOne({
                where: {
                    userId: targetUserId,
                    subscriberId: id
                }
            });

            if (!subscription) {
                return res.status(400).json({ message: 'Вы не подписаны на этого пользователя' });
            }

            await subscription.destroy();
            return res.json({ message: `Вы отписались от пользователя с ID ${targetUserId}` });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }


    //http://localhost:4000/api/subscribers/subscriptions
        //Headers:
    //Authorization Bearer eyJhbGciOiJIU...
        //Query Params:
    // targetUserId 1
    //type subscriptions
    async getSubscriptions(req, res, next) {
        const { id } = req.user; // ID текущего авторизованного пользователя
        const { targetUserId, type } = req.query; // ID пользователя и тип запроса (подписки или подписчики)

        console.log(id, targetUserId, type);
        try {
            // Если `targetUserId` не указан, используем текущего пользователя
            const userIdToQuery = targetUserId || id;

            if (!type || (type !== 'subscriptions' && type !== 'subscribers')) {
                return res.status(400).json({ message: "Укажите корректный тип запроса: 'subscriptions' или 'subscribers'" });
            }

            if (type === 'subscriptions') {
                // Получить пользователей, на которых подписан указанный пользователь
                const subscriptions = await Subscription.findAll({
                    where: { subscriberId: userIdToQuery },
                    include: { model: User, as: 'subscribedUser' } // Подключаем данные пользователей, на которых подписан
                });
                return res.json(subscriptions);
            } else if (type === 'subscribers') {
                // Получить подписчиков указанного пользователя
                const subscribers = await Subscription.findAll({
                    where: { userId: userIdToQuery },
                    include: { model: User, as: 'subscribingUser' } // Подключаем данные подписчиков
                });
                return res.json(subscribers);
            }
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

}

module.exports = new SubscribersController()