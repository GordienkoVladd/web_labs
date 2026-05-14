const Post = require('../models/Post');
const Comment = require('../models/Comment');
const ApiError = require('../errors/ApiError');
const asyncHandler = require('../middlewares/asyncHandler');

// Створити пост (автоматично додається createdBy)
exports.createPost = asyncHandler(async (req, res) => {
    const post = await Post.create({
        ...req.body,
        createdBy: req.user._id
    });
    res.status(201).json({ success: true, data: post });
});

// Отримати всі пости з пагінацією (публічний)
exports.getAllPosts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find().skip(skip).limit(limit).populate('createdBy', 'name email');
    const total = await Post.countDocuments();

    res.status(200).json({
        success: true,
        data: posts,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
});

// Пошук постів (публічний)
exports.searchPosts = asyncHandler(async (req, res) => {
    const { q } = req.query;
    const posts = await Post.find({
        $or: [
            { title: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } }
        ]
    });
    res.status(200).json({ success: true, data: posts });
});

// Отримати один пост за ID (з коментарями, публічний)
exports.getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('createdBy', 'name email');
    if (!post) {
        throw ApiError.notFound('Пост не знайдено');
    }
    const comments = await Comment.find({ post: post._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { post, comments } });
});

// Оновити пост (тільки авторизований)
exports.updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
    );
    if (!post) {
        throw ApiError.notFound('Пост не знайдено');
    }
    res.status(200).json({ success: true, data: post });
});

// Лайкнути пост (публічний)
exports.likePost = asyncHandler(async (req, res) => {
    const post = await Post.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } },
        { new: true }
    );
    if (!post) {
        throw ApiError.notFound('Пост не знайдено');
    }
    res.status(200).json({ success: true, data: post });
});

// Видалити пост (тільки admin)
exports.deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        throw ApiError.notFound('Пост не знайдено');
    }
    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Пост та всі коментарі видалено' });
});