const catchAsync = require('../utils/catchAsync');
const postService = require('../services/postService');

exports.getAllPosts = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { posts, pagination } = await postService.getAllPosts(page, limit);
    res.status(200).json({ success: true, data: posts, pagination });
});

exports.searchPosts = catchAsync(async (req, res) => {
    const { q } = req.query;
    const posts = await postService.searchPosts(q);
    res.status(200).json({ success: true, data: posts });
});

exports.getPostById = catchAsync(async (req, res) => {
    const { post, comments } = await postService.getPostById(req.params.id);
    res.status(200).json({ success: true, data: { post, comments } });
});

exports.createPost = catchAsync(async (req, res) => {
    const post = await postService.createPost(req.body, req.user._id);
    res.status(201).json({ success: true, data: post });
});

exports.updatePost = catchAsync(async (req, res) => {
    const post = await postService.updatePost(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: post });
});

exports.likePost = catchAsync(async (req, res) => {
    const post = await postService.likePost(req.params.id);
    res.status(200).json({ success: true, data: post });
});

exports.deletePost = catchAsync(async (req, res) => {
    await postService.deletePost(req.params.id);
    res.status(200).json({ success: true, message: 'Пост та всі коментарі видалено' });
});

