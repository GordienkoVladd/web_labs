require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authRoutes = require('./routes/authRoutes');
const ApiError = require('./errors/ApiError');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

connectDB();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// 404
app.use((req, res, next) => {
    next(ApiError.notFound('Маршрут не знайдено'));
});

// Обробник помилок
app.use(errorHandler);

module.exports = app;