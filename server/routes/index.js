const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter') //Если в userRouter есть маршрут GET /profile, //http://localhost:4000/api/user/profile
const postRouter = require('./postRouter')
const categoryRouter = require('./categoryRouter')
const commenRouter = require('./commenRouter')
const subscribersRouter = require('./subscribersRouter')

//что будет идти после /api/...
router.use('/user', userRouter)
router.use('/post', postRouter)
router.use('/category', categoryRouter)
router.use('/comment', commenRouter)
router.use('/subscribers',subscribersRouter)


module.exports = router
