const Router = require('express')
const router = new Router()
const commentController = require("../controllers/commentController");


/*router.post('/')
router.get('/')
router.get('/:id')
router.delete('/')*/


router.get('/posts/:postId/comments', commentController.getPostComments); // Комментарии к опред посту
router.post('/posts/:id/comments', commentController.create); // Создать
router.delete('/posts/:postId/comments/:commentId', commentController.delete); // Удалить

router.post('/posts/:id/comments/:id/like', commentController.like); // лайкнуть //НЕ СДЕЛАНО



module.exports = router