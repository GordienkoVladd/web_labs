const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const validate = require('../middlewares/validate');
const commentV = require('../middlewares/validators/commentValidator');

router.post('/', commentV.createCommentRules, validate, commentController.createComment);
router.get('/post/:postId', commentV.getCommentsRules, validate, commentController.getCommentsByPost);
router.put('/:id', commentV.updateCommentRules, validate, commentController.updateComment);
router.delete('/:id', commentV.mongoIdParamRule, validate, commentController.deleteComment);

module.exports = router;