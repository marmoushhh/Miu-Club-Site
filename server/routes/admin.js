const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin, isAuthenticated } = require('../middleware/auth');

// Admin dashboard
router.get('/', isAuthenticated, isAdmin, adminController.getDashboard);

// User management
router.post('/users/:id/approve', isAuthenticated, isAdmin, adminController.approveUser);
router.post('/users/:id/reject', isAuthenticated, isAdmin, adminController.rejectUser);
router.post('/users/:id/delete', isAuthenticated, isAdmin, adminController.deleteUser);

// Post management
router.post('/posts/:id/delete', isAuthenticated, isAdmin, adminController.deletePost);

module.exports = router; 