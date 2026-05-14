const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const validate = require('../middlewares/validate');
const postV = require('../middlewares/validators/postValidator');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

// Публічні маршрути
router.get('/', postV.getPostsRules, validate, postController.getAllPosts);
router.get('/search', postV.searchPostsRules, validate, postController.searchPosts);
router.get('/:id', postV.mongoIdParamRule, validate, postController.getPostById);
router.patch('/:id/like', postV.mongoIdParamRule, validate, postController.likePost);

// Захищені маршрути
router.post('/', protect, postV.createPostRules, validate, postController.createPost);
router.put('/:id', protect, postV.updatePostRules, validate, postController.updatePost);

// Тільки для адміністратора
router.delete('/:id', protect, restrictTo('admin'), postV.mongoIdParamRule, validate, postController.deletePost);

module.exports = router;