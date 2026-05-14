const express = require('express');
const router = express.Router();
const { register } = require('../controllers/authController');
const { registerRules } = require('../middlewares/validators/authValidator');
const validate = require('../middlewares/validate');

router.post('/register', registerRules, validate, register);

module.exports = router;