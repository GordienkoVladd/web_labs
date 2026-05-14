const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../errors/ApiError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw ApiError.unauthorized('Доступ заборонено. Токен відсутній');
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw ApiError.unauthorized('Термін дії токена вийшов. Увійдіть знову');
        }
        if (err.name === 'JsonWebTokenError') {
            throw ApiError.unauthorized('Невірний токен. Увійдіть знову');
        }
        throw err;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        throw ApiError.unauthorized('Користувача не знайдено');
    }

    req.user = user;
    next();
});

module.exports = protect;