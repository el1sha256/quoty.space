const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.post('/user/register', userController.registration)
router.post('/login', userController.login)
router.get('/auth', userController.check)

router.get('/users', userController.getAll)
router.get('/users/:id', userController.getOne)
router.put('/user/update', userController.update)
router.delete('/user/delete', userController.delete)
router.post('/user/upload-avatar/:userId', userController.avatarUpl)




module.exports = router