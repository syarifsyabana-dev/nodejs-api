const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Rute untuk registrasi pengguna
router.post('/register', AuthController.registerUser);

// Rute untuk login pengguna
router.post('/login', AuthController.loginUser);

module.exports = router;