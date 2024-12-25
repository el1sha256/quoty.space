const Router = require('express')
const router = new Router()
const commentController = require("../controllers/commentController");


router.get('/:postId/comments', commentController.getPostComments); // Комментарии к опред посту
router.post('/:id/create', commentController.create); // Создать //id of the post itself
router.delete('/:postId/comments/:commentId', commentController.delete); // Удалить

router.post('/:postId/comments/:commentId/like', commentController.like); // лайкнуть //НЕ СДЕЛАНО
router.post('/:postId/comments/:commentId/unlike', commentController.unlike); // лайкнуть //НЕ СДЕЛАНО


module.exports = router