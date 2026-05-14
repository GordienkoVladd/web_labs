const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApiError = require('../errors/ApiError');
const asyncHandler = require('../middlewares/asyncHandler');

// Реєстрація нового користувача
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Перевірка, чи існує користувач з таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw ApiError.badRequest('Користувач з таким email вже існує');
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення користувача
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    // Відповідь (без пароля)
    res.status(201).json({
        success: true,
        message: 'Реєстрація успішна',
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }
    });
});