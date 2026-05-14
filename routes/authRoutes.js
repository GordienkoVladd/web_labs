const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { registerRules } = require('../middlewares/validators/authValidator');
const validate = require('../middlewares/validate');
const protect = require('../middlewares/protect');

// Публічні маршрути
router.post('/register', registerRules, validate, register);
router.post('/login', login);

// Захищені маршрути (потребують токена)
router.get('/me', protect, getMe);

module.exports = router;