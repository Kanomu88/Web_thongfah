const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth/auth.login.controller');
const { register } = require('../controllers/auth/auth.register.controller');

router.post('/login', login);
router.post('/register', register);

module.exports = router;
