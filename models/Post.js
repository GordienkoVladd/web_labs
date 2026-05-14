const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    tags: [String],
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Індекс для текстового пошуку (Завдання 2)
postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);