const Router = require('express')
const router = new Router()
const categoryController = require("../controllers/categoriesController");


//http://localhost:4000/api/category/categories
//http://localhost:4000/api/category/delete/9

router.get('/categories', categoryController.getCategories) //get all of them
router.post('/create', categoryController.create); // Создать
router.delete('/delete/:id', categoryController.delete); // Удалить

//in user add this I think
router.post('/categories/:id/like', categoryController.like); // лайкнуть //НЕ СДЕЛАНО


module.exports = router
