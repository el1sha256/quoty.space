const Router = require('express')
const router = new Router()
const categoryController = require("../controllers/categoriesController");
const checkRole = require("../middleware/checkRoleMiddleware");


//http://localhost:4000/api/category/categories
//http://localhost:4000/api/category/delete/9


/**
 * @swagger
 * /api/category/categories:
 *   get:
 *     summary: Получить все категории
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список всех категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID категории
 *                   name:
 *                     type: string
 *                     description: Название категории
 *       500:
 *         description: Ошибка сервера
 */
router.get('/categories', categoryController.getCategories) //get all of them


/**
 * @swagger
 * /api/category/create:
 *   post:
 *     summary: Создать новую категорию
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название категории
 *                 example: "Технологии"
 *     responses:
 *       201:
 *         description: Категория успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение о создании категории
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID категории
 *                       name:
 *                         type: string
 *                         description: Название категории
 *       400:
 *         description: Название категории обязательно
 *       403:
 *         description: Доступ запрещен (требуется роль ADMIN)
 *       500:
 *         description: Ошибка сервера
 */
router.post('/create',checkRole('ADMIN'), categoryController.create); // Создать


/**
 * @swagger
 * /api/category/delete/{id}:
 *   delete:
 *     summary: Удалить категорию по ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID категории, которую нужно удалить
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Категория успешно удалена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об удалении категории
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID категории
 *                       name:
 *                         type: string
 *                         description: Название категории
 *       404:
 *         description: Категория не найдена
 *       403:
 *         description: Доступ запрещен (требуется роль ADMIN)
 *       500:
 *         description: Ошибка сервера
 */
router.delete('/delete/:id',checkRole('ADMIN'), categoryController.delete); // Удалить

/*//in user add this I think
router.post('/categories/:id/like', categoryController.like); // лайкнуть //НЕ СДЕЛАНО*/


module.exports = router
