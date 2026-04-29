const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

router.post('/register', validate(schemas.register), authController.register);
router.post('/login', validate(schemas.login), authController.login);
router.post('/logout', protect, authController.logout);
router.post('/refresh-token', authController.refreshToken);

router.get('/me', protect, authController.getMe);
router.put('/profile', protect, validate(schemas.updateProfile), authController.updateProfile);
router.put('/change-password', protect, validate(schemas.changePassword), authController.changePassword);

router.get('/', protect, adminOnly, authController.getAllUsers);
router.get('/:id', protect, adminOnly, authController.getUserById);
router.put('/:id', protect, adminOnly, validate(schemas.updateProfile), authController.updateUser);
router.delete('/:id', protect, adminOnly, authController.deleteUser);

module.exports = router;
