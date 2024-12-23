const Router = require('express')
const router = new Router()
const categoryController = require("../controllers/categoriesController");


router.get('/categories', categoryController.getCategories)

router.post('/categories/:id', categoryController.create); // Создать //НЕ СДЕЛАНО
router.delete('/categories/:id/delete', categoryController.delete); // Удалить
/*router.get('/:id')*/
router.post('/categories/:id/like', categoryController.like); // лайкнуть //НЕ СДЕЛАНО


module.exports = router
