const ApiError = require('../errors/ApiError');

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw ApiError.forbidden('У вас немає прав для цієї дії');
        }
        next();
    };
};

module.exports = restrictTo;