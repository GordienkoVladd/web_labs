const ApiError = require('../errors/ApiError');

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Помилка сервера';
    let errors = err.errors || [];

    // Кастомна помилка ApiError
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors || [];
    }

    // Помилка MongoDB: невірний ObjectId (CastError)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Невірний формат ID';
        errors = [{ field: err.path, msg: 'Некоректний ObjectId' }];
    }

    // Помилка валідації Mongoose (схема)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Помилка валідації даних';
        errors = Object.values(err.errors).map(e => ({
            field: e.path,
            msg: e.message
        }));
    }

    // Помилка дублювання ключа (MongoDB)
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Дублювання значення поля';
        const field = Object.keys(err.keyPattern)[0];
        errors = [{ field, msg: `${field} повинен бути унікальним` }];
    }

    // Логування помилки для розробника
    console.error(`[ERROR] ${statusCode}: ${message}`, err);

    res.status(statusCode).json({
        success: false,
        message,
        errors: errors.length ? errors : undefined,
        statusCode
    });
};

module.exports = errorHandler;