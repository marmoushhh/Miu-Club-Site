const JoinRequest = require('../models/JoinRequest');
const Club = require('../models/Club');
const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// View all join requests
exports.getAllJoinRequests = async (req, res) => {
    try {
        const requests = await JoinRequest.find()
            .populate('user', 'username email status')
            .populate('club', 'name');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching join requests.' });
    }
};

// Accept a join request
exports.acceptJoinRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const joinRequest = await JoinRequest.findById(id).populate('club user');
        if (!joinRequest) return res.status(404).json({ message: 'Join request not found.' });
        if (joinRequest.status === 'accepted') return res.status(400).json({ message: 'Already accepted.' });
        joinRequest.status = 'accepted';
        await joinRequest.save();
        // Add user to club members if not already present
        const club = await Club.findById(joinRequest.club._id);
        if (!club.members.includes(joinRequest.user._id)) {
            club.members.push(joinRequest.user._id);
            await club.save();
        }
        res.json({ message: 'Join request accepted and user added to club.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error accepting join request.' });
    }
};

// Reject a join request
exports.rejectJoinRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const joinRequest = await JoinRequest.findById(id);
        if (!joinRequest) return res.status(404).json({ message: 'Join request not found.' });
        if (joinRequest.status === 'rejected') return res.status(400).json({ message: 'Already rejected.' });
        joinRequest.status = 'rejected';
        await joinRequest.save();
        res.json({ message: 'Join request rejected.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error rejecting join request.' });
    }
};

// Get admin dashboard
exports.getDashboard = async (req, res) => {
    try {
        // Get counts
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const activeClubs = await Club.countDocuments();

        // Get pending users
        const pendingUsers = await User.find({ status: 'pending' })
            .sort({ createdAt: -1 });

        // Get active users
        const activeUsers = await User.find({ status: { $in: ['accepted', 'rejected'] } })
            .sort({ createdAt: -1 });

        // Get recent posts
        const posts = await Post.find()
            .populate('author', 'username')
            .populate('club', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        res.render('pages/admin', {
            title: 'MIU Clubs Admin',
            path: '/admin',
            totalUsers,
            totalPosts,
            activeClubs,
            pendingUsers,
            activeUsers,
            posts,
            layout: false
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Error loading admin dashboard'
        });
    }
};

// Approve user
exports.approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.status = 'accepted';
        await user.save();
        // Send notification for account approval
        await Notification.create({
            user: user._id,
            message: 'Your account has been approved! You can now log in.'
        });
        res.redirect('/admin');
    } catch (err) {
        console.error('Approve user error:', err);
        res.status(500).json({ message: 'Error approving user' });
    }
};

// Reject user
exports.rejectUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.status = 'rejected';
        await user.save();
        res.redirect('/admin');
    } catch (err) {
        console.error('Reject user error:', err);
        res.status(500).json({ message: 'Error rejecting user' });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.deleteOne({ _id: req.params.id });
        res.redirect('/admin');
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

// Delete post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await post.remove();
        res.redirect('/admin');
    } catch (err) {
        console.error('Delete post error:', err);
        res.status(500).json({ message: 'Error deleting post' });
    }
}; 