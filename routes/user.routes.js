const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.put('/change-password', authMiddleware, userController.changePassword);
router.delete('/delete', authMiddleware, userController.deleteUser);

module.exports = router;
