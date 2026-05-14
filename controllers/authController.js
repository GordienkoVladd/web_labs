const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../errors/ApiError');
const asyncHandler = require('../middlewares/asyncHandler');

// Генерація JWT токена
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Реєстрація (з ЛР9)
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw ApiError.badRequest('Користувач з таким email вже існує');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

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

// Вхід користувача (НОВИЙ)
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Перевірка наявності полів
    if (!email || !password) {
        throw ApiError.badRequest('Введіть email та пароль');
    }

    // 2. Пошук користувача (з паролем, бо select: false)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw ApiError.unauthorized('Невірний email або пароль');
    }

    // 3. Перевірка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw ApiError.unauthorized('Невірний email або пароль');
    }

    // 4. Генерація токена
    const token = generateToken(user._id, user.role);

    // 5. Відповідь
    res.status(200).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// Отримати профіль поточного користувача (НОВИЙ)
exports.getMe = asyncHandler(async (req, res) => {
    // req.user встановлюється middleware protect
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }
    });
});