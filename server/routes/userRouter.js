const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', userController.registration)
router.post('/login', userController.login)

router.get('/auth', authMiddleware, userController.check) //чекает пользователя на авторизованность

/*router.get('/users',authMiddleware,  userController.getAll)*/
router.get('/users',  userController.getAll)
router.get('/users/:id', userController.getOne)

router.put('/update', authMiddleware, userController.update)

router.delete('/delete', authMiddleware, userController.delete)

router.post('/upload-avatar/:userId', authMiddleware, userController.avatarUpl)




module.exports = router