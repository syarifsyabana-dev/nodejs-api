const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rute untuk mendapatkan daftar pengguna
router.get('/', authMiddleware, userController.getUsers);

// Rute untuk mendapatkan pengguna berdasarkan ID
router.get('/:id', authMiddleware, userController.getUserById);

// Rute untuk membuat pengguna baru
router.post('/', authMiddleware, userController.createUser);

// Rute untuk pembaruan pengguna
router.put('/:id', authMiddleware, userController.updateUser);

// Rute untuk menghapus pengguna
router.delete('/:id', authMiddleware, userController.deleteUser);
// router.delete('/:id', userController.deleteUser);

module.exports = router;
