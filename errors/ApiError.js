class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static notFound(message = 'Ресурс не знайдено') {
        return new ApiError(404, message);
    }

    static internal(message = 'Внутрішня помилка сервера') {
        return new ApiError(500, message);
    }

    static unauthorized(message = 'Неавторизований доступ') {
        return new ApiError(401, message);
    }
}

module.exports = ApiError;