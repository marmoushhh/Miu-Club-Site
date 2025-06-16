const express = require('express');
const router = express.Router();
const joinRequestController = require('../controllers/joinRequestController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// User submits join request to a club
router.post('/join', isAuthenticated, joinRequestController.submitJoinRequest);
// User submits join request to the community
router.post('/community/join', isAuthenticated, joinRequestController.submitCommunityJoinRequest);

// Admin views all join requests
router.get('/admin/join-requests', isAuthenticated, isAdmin, joinRequestController.listJoinRequests);
// Admin approves join request
router.post('/admin/join-requests/:id/approve', isAuthenticated, isAdmin, joinRequestController.approveJoinRequest);
// Admin rejects join request
router.post('/admin/join-requests/:id/reject', isAuthenticated, isAdmin, joinRequestController.rejectJoinRequest);

// Admin views all community join requests
router.get('/admin/community-join-requests', isAuthenticated, isAdmin, joinRequestController.listCommunityJoinRequests);
// Admin approves community join request
router.post('/admin/community-join-requests/:id/approve', isAuthenticated, isAdmin, joinRequestController.approveCommunityJoinRequest);
// Admin rejects community join request
router.post('/admin/community-join-requests/:id/reject', isAuthenticated, isAdmin, joinRequestController.rejectCommunityJoinRequest);

// Update session for communityMember via AJAX
router.post('/update-session-community', isAuthenticated, joinRequestController.updateSessionCommunityMember);

module.exports = router; 