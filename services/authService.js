const User = require('../models/User');
const bcrypt = require('bcryptjs');
const ApiError = require('../errors/ApiError');

exports.registerUser = async (userData) => {
    const { name, email, password, confirmPassword } = userData;

    if (password !== confirmPassword) {
        throw ApiError.badRequest('Паролі не збігаються');
    }

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

    return user;
};

exports.loginUser = async (credentials) => {
    const { email, password } = credentials;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw ApiError.unauthorized('Невірний email або пароль');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw ApiError.unauthorized('Невірний email або пароль');
    }

    return user;
};