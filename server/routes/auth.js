const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

// Get auth pages
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);
router.get('/admin-login', authController.getAdminLogin);

// Handle auth actions
router.post('/login', authController.postLogin);
router.post('/register', authController.postRegister);
router.post('/admin-login', authController.postAdminLogin);
router.post('/logout', isAuthenticated, authController.logout);

module.exports = router; 