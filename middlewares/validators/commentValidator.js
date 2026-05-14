const { body, param, query } = require('express-validator');

// Правила для створення коментаря
exports.createCommentRules = [
    body('content')
        .trim()
        .notEmpty().withMessage('Текст коментаря обов\'язковий')
        .isLength({ min: 1, max: 1000 }).withMessage('Довжина коментаря: 1-1000 символів'),
    body('postId')
        .isMongoId().withMessage('Невірний формат ID поста'),
    body('author')
        .trim()
        .notEmpty().withMessage('Автор обов\'язковий')
];

// Правила для отримання коментарів поста
exports.getCommentsRules = [
    param('postId')
        .isMongoId().withMessage('Невірний формат ID поста'),
    query('page')
        .optional()
        .toInt()
        .isInt({ min: 1 }).withMessage('Сторінка має бути >= 1'),
    query('limit')
        .optional()
        .toInt()
        .isInt({ min: 1, max: 100 }).withMessage('Ліміт: 1-100')
];

// Правила для оновлення коментаря
exports.updateCommentRules = [
    param('id')
        .isMongoId().withMessage('Невірний формат ID коментаря'),
    body('content')
        .trim()
        .notEmpty().withMessage('Текст коментаря не може бути порожнім')
        .isLength({ min: 1, max: 1000 }).withMessage('Довжина коментаря: 1-1000 символів')
];

// Правила для MongoDB ID параметра
exports.mongoIdParamRule = [
    param('id').isMongoId().withMessage('Невірний формат ID')
];

// Для зворотної сумісності, якщо використовується стара назва
exports.mongoldParamRule = exports.mongoIdParamRule;