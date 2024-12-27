const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               userName:
 *                 type: string
 *               description:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Некорректные данные или пользователь уже существует
 */
router.post('/register', userController.registration)


/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Вход в аккаунт
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Авторизация успешна, возвращает токен
 *       400:
 *         description: Неверные данные или пользователь не найден
 */
router.post('/login', userController.login)


/**
 * @swagger
 * /api/user/auth:
 *   get:
 *     summary: Проверка токена и обновление
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Возвращает новый токен
 *       401:
 *         description: Неверный токен
 */
router.get('/auth', authMiddleware, userController.check) //чекает пользователя на авторизованность



/**
 * @swagger
 * /api/user/users:
 *   get:
 *     summary: Получить список всех пользователей
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Список пользователей
 *       500:
 *         description: Ошибка сервера
 */
router.get('/users',  userController.getAll)

/**
 * @swagger
 * /api/user/users/{id}:
 *   get:
 *     summary: Получить информацию о пользователе
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Возвращает информацию о пользователе
 *       404:
 *         description: Пользователь не найден
 */
router.get('/users/:id', userController.getOne)


/**
 * @swagger
 * /api/user/update:
 *   put:
 *     summary: Обновление данных пользователя
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               userName:
 *                 type: string
 *               description:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Пользователь обновлен
 *       404:
 *         description: Пользователь не найден
 */
router.put('/update', authMiddleware, userController.update)


/**
 * @swagger
 * /api/user/delete:
 *   delete:
 *     summary: Удаление пользователя
 *     tags: [User]
 *     security:
 *       - bearerAuth: []  # Требование токена для авторизации
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Электронная почта пользователя
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: Пароль пользователя для подтверждения
 *                 example: password123
 *     responses:
 *       200:
 *         description: Пользователь успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пользователь успешно удален
 *       401:
 *         description: Неавторизован. Требуется токен авторизации.
 *       404:
 *         description: Пользователь не найден
 *       400:
 *         description: Неверный формат данных или обязательные поля отсутствуют
 */
router.delete('/delete', authMiddleware, userController.delete)



/**
 * @swagger
 * /api/user/upload-avatar/{userId}:
 *   put:
 *     summary: Загрузка аватара
 *     tags: [User]
 *     security:
 *       - bearerAuth: []  # Указывает, что требуется авторизация через токен
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Аватар успешно загружен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Аватар успешно загружен
 *                 avatar:
 *                   type: string
 *                   example: имя_файла.jpg
 *       403:
 *         description: Доступ запрещен. Вы не можете загрузить аватар для другого пользователя.
 *       404:
 *         description: Пользователь не найден
 *       400:
 *         description: Файл не загружен или отсутствует
 */
router.post('/upload-avatar/:userId', authMiddleware, userController.avatarUpl)




module.exports = router