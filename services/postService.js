const Post = require('../models/Post');
const Comment = require('../models/Comment');
const ApiError = require('../errors/ApiError');

exports.getAllPosts = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const posts = await Post.find()
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    const total = await Post.countDocuments();
    return { posts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

exports.getPostById = async (id) => {
    const post = await Post.findById(id).populate('createdBy', 'name email');
    if (!post) throw ApiError.notFound('Пост не знайдено');
    const comments = await Comment.find({ post: post._id }).sort({ createdAt: -1 });
    return { post, comments };
};

exports.searchPosts = async (query) => {
    return await Post.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } }
        ]
    }).populate('createdBy', 'name email');
};

exports.createPost = async (data, userId) => {
    return await Post.create({ ...data, createdBy: userId });
};

exports.updatePost = async (id, data, currentUser) => {
    const post = await Post.findById(id);
    if (!post) throw ApiError.notFound('Пост не знайдено');

    if (!post.createdBy) {
        throw ApiError.badRequest('Пост не має власника');
    }

    const isOwner = post.createdBy.toString() === currentUser._id.toString();
    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw ApiError.forbidden('Ви не маєте прав редагувати цей пост');
    }

    const updatedPost = await Post.findByIdAndUpdate(
        id,
        { ...data, updatedAt: Date.now() },
        { new: true, runValidators: true }
    );

    return updatedPost;
};

exports.likePost = async (id) => {
    const post = await Post.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    if (!post) throw ApiError.notFound('Пост не знайдено');
    return post;
};

exports.deletePost = async (id) => {
    const post = await Post.findById(id);
    if (!post) throw ApiError.notFound('Пост не знайдено');
    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    return post;
};