const User = require('../models/User');
const Notification = require('../models/Notification');
const JoinRequest = require('../models/JoinRequest');

// Check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.redirect('/auth/login');
};

// Make user data available to all views, always up-to-date
exports.setUserLocals = async (req, res, next) => {
    if (req.session.user) {
        try {
            const user = await User.findById(req.session.user.id).populate('clubs.club').lean();
            if (user) {
                // Fetch join requests for this user
                const joinRequests = await JoinRequest.find({ user: user._id }).lean();
                
                // Create a complete user object with all necessary data
                const sessionUser = {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    clubs: user.clubs || [],
                    communityMember: user.communityMember || false,
                    joinRequests,
                    status: user.status,
                    createdAt: user.createdAt,
                    avatar: user.avatar || '/img/default-avatar.jpg',
                    bio: user.bio || ''
                };
                
                // Update both session and locals
                req.session.user = sessionUser;
                res.locals.user = sessionUser;
                
                // Fetch unread notifications
                res.locals.notifications = await Notification.find({ user: user._id, read: false })
                    .sort({ createdAt: -1 })
                    .lean();
            } else {
                req.session.user = null;
                res.locals.user = null;
                res.locals.notifications = [];
            }
        } catch (err) {
            console.error('Error in setUserLocals:', err);
            res.locals.user = req.session.user;
            res.locals.notifications = [];
        }
    } else {
        res.locals.user = null;
        res.locals.notifications = [];
    }
    next();
}; 