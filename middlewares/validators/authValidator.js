const { body } = require('express-validator');

exports.registerRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Ім\'я є обов\'язковим')
        .isLength({ min: 2 }).withMessage('Ім\'я має містити хоча б 2 символи'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email є обов\'язковим')
        .isEmail().withMessage('Невірний формат email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Пароль є обов\'язковим')
        .isLength({ min: 8 }).withMessage('Пароль має містити хоча б 8 символів'),

    body('confirmPassword')
        .notEmpty().withMessage('Підтвердження пароля є обов\'язковим')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Паролі не збігаються');
            }
            return true;
        })
];