const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');
const ApiError = require('../errors/ApiError');

const protect = asyncHandler(async (req, res, next) => {
    // 1. Отримати токен з заголовка Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw ApiError.unauthorized('Доступ заборонено. Токен відсутній');
    }

    const token = authHeader.split(' ')[1];

    // 2. Верифікувати токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Знайти користувача за id з токена
    const user = await User.findById(decoded.id);

    if (!user) {
        throw ApiError.unauthorized('Користувача не знайдено');
    }

    // 4. Додати користувача до об'єкта запиту
    req.user = user;
    next();
});

module.exports = protect;