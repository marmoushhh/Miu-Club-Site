const JoinRequest = require('../models/JoinRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Club = require('../models/Club');

// Submit a join request
exports.submitJoinRequest = async (req, res) => {
    const user = req.session.user;
    const { club, note } = req.body;
    if (!user) {
        return res.redirect('/auth/login?error=You must be logged in to join a club.');
    }
    try {
        // Check for existing join request
        const existing = await JoinRequest.findOne({ user: user.id, club, status: { $in: ['pending', 'accepted'] } });
        if (existing) {
            // Fetch clubs for rendering
            const clubs = [
                { name: 'ACPC' }, { name: 'Enactus' }, { name: 'TEDx' }, { name: 'MUN' },
                { name: 'Gamers Legacy' }, { name: 'Tunners' }, { name: 'El Warsha' }, { name: 'MOVE' }, { name: 'IHEPC' }
            ];
            let errorMsg = existing.status === 'pending'
                ? 'You have already requested to join this club.'
                : 'You are already a member in this club.';
            return res.status(400).render('pages/contact', {
                clubs,
                user: req.session.user,
                error: errorMsg,
                success: undefined
            });
        }
        const joinRequest = new JoinRequest({ user: user.id, club, status: 'pending' });
        await joinRequest.save();
        // Fetch clubs for rendering
        const clubs = [
            { name: 'ACPC' }, { name: 'Enactus' }, { name: 'TEDx' }, { name: 'MUN' },
            { name: 'Gamers Legacy' }, { name: 'Tunners' }, { name: 'El Warsha' }, { name: 'MOVE' }, { name: 'IHEPC' }
        ];
        return res.render('pages/contact', {
            clubs,
            user: req.session.user,
            success: 'Join request submitted! Wait for admin approval.',
            error: undefined
        });
    } catch (err) {
        // Fetch clubs for rendering
        const clubs = [
            { name: 'ACPC' }, { name: 'Enactus' }, { name: 'TEDx' }, { name: 'MUN' },
            { name: 'Gamers Legacy' }, { name: 'Tunners' }, { name: 'El Warsha' }, { name: 'MOVE' }, { name: 'IHEPC' }
        ];
        return res.status(500).render('pages/contact', {
            clubs,
            user: req.session.user,
            error: 'Server error submitting join request.',
            success: undefined
        });
    }
};

// Admin: List all join requests
exports.listJoinRequests = async (req, res) => {
    try {
        const requests = await JoinRequest.find().populate('user', 'username email').sort({ createdAt: -1 });
        res.render('pages/admin-join-requests', { requests, user: req.session.user });
    } catch (err) {
        res.status(500).send('Error fetching join requests.');
    }
};

// Admin: Approve join request (AJAX)
exports.approveJoinRequest = async (req, res) => {
    try {
        console.log('APPROVE JOIN REQUEST: id =', req.params.id);
        const request = await JoinRequest.findById(req.params.id).populate('user');
        console.log('JoinRequest:', request);
        if (!request) return res.status(404).json({ success: false, message: 'Join request not found.' });
        request.status = 'accepted';
        await request.save();
        // Add club to user's clubs array if not already present
        const user = await User.findById(request.user._id);
        console.log('User:', user);
        console.log('User.clubs:', user ? user.clubs : undefined);
        console.log('Request.club:', request.club);
        // Find the club by name (case-insensitive)
        const clubDoc = await Club.findOne({ name: new RegExp('^' + request.club + '$', 'i') });
        console.log('clubDoc:', clubDoc);
        if (user && clubDoc && !user.clubs.some(obj => obj.club && obj.club.toString() === clubDoc._id.toString())) {
            user.clubs.push({ club: clubDoc._id, joinedAt: new Date() });
            await user.save();
            // Add user to club's members array if not already present
            if (!clubDoc.members) clubDoc.members = [];
            if (!clubDoc.members.some(id => id.toString() === user._id.toString())) {
                clubDoc.members.push(user._id);
                await clubDoc.save();
            }
            // Log the updated user from the DB
            const updatedUser = await User.findById(user._id);
            console.log('User after save (from DB):', updatedUser);
            // Fallback: ensure the DB is updated
            await User.updateOne(
              { _id: user._id, 'clubs.club': { $ne: clubDoc._id } },
              { $push: { clubs: { club: clubDoc._id, joinedAt: new Date() } } }
            );
            const afterUpdateUser = await User.findById(user._id);
            console.log('User after updateOne (from DB):', afterUpdateUser);
        }
        // Send notification for club join approval
        await Notification.create({
            user: user._id,
            message: `You have been accepted as a member of ${request.club}!`
        });
        // Update session if the approved user is the logged-in user
        if (req.session.user && req.session.user.id === user._id.toString()) {
            const populatedUser = await User.findById(user._id).populate('clubs.club').lean();
            req.session.user.clubs = populatedUser.clubs;
            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err) {
                        console.error('Error saving session:', err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
        return res.json({ success: true, status: 'accepted', userId: user._id, club: request.club });
    } catch (err) {
        console.error('Error in approveJoinRequest:', err);
        return res.status(500).json({ success: false, message: 'Error approving join request.' });
    }
};

// Admin: Reject join request (AJAX)
exports.rejectJoinRequest = async (req, res) => {
    try {
        const request = await JoinRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: 'Join request not found.' });
        request.status = 'rejected';
        await request.save();
        return res.json({ success: true, status: 'rejected' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error rejecting join request.' });
    }
};

// Community: Submit join request
exports.submitCommunityJoinRequest = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/auth/login?error=You must be logged in to join the community.');
    }
    // Check if user is a member of any club
    const dbUser = await User.findById(user.id);
    if (!dbUser.clubs || dbUser.clubs.length === 0) {
        return res.redirect('/communities?error=You must be a member of at least one club to join the community.');
    }
    // Check for existing request
    const existing = await JoinRequest.findOne({ user: user.id, type: 'community', status: { $in: ['pending', 'accepted'] } });
    if (existing) {
        return res.redirect('/communities?error=' + (existing.status === 'pending' ? 'You have already requested to join the community.' : 'You are already a member of the community.'));
    }
    await JoinRequest.create({ user: user.id, club: 'community', type: 'community', status: 'pending' });
    return res.redirect('/communities?success=Community join request submitted! Wait for admin approval.');
};

// Admin: List all community join requests
exports.listCommunityJoinRequests = async (req, res) => {
    try {
        const requests = await JoinRequest.find({ type: 'community' }).populate('user', 'username email').sort({ createdAt: -1 });
        res.render('pages/admin-community-join-requests', { requests, user: req.session.user, layout: false });
    } catch (err) {
        res.status(500).send('Error fetching community join requests.');
    }
};

// Admin: Approve community join request (AJAX)
exports.approveCommunityJoinRequest = async (req, res) => {
    try {
        console.log('Starting community join request approval...');
        
        // 1. Find and validate the request
        const request = await JoinRequest.findById(req.params.id).populate('user');
        if (!request) {
            console.log('Request not found');
            return res.status(404).json({ success: false, message: 'Join request not found.' });
        }
        console.log('Found request:', request);
        
        // 2. Update request status
        request.status = 'accepted';
        await request.save();
        console.log('Request status updated to accepted');
        
        // 3. Find and update the user
        const user = await User.findById(request.user._id);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        console.log('Found user:', user);
        
        // 4. Update user's community member status
        user.communityMember = true;
        await user.save();
        console.log('User communityMember set to true');
        
        // 5. Verify the update
        const updatedUser = await User.findById(user._id);
        console.log('Updated user:', updatedUser);
        
        // 6. Update session if the approved user is the logged-in user
        if (req.session.user && req.session.user.id === user._id.toString()) {
            console.log('Updating session for logged-in user');
            req.session.user.communityMember = true;
            req.session.user.clubs = updatedUser.clubs;
            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err) {
                        console.error('Error saving session:', err);
                        reject(err);
                    } else {
                        console.log('Session saved successfully');
                        resolve();
                    }
                });
            });
        }
        
        // 7. Send notification
        await Notification.create({
            user: user._id,
            message: `You have been accepted into the Clubs Community!`
        });
        console.log('Notification created');
        
        // 8. Send success response
        return res.json({ 
            success: true, 
            status: 'accepted', 
            userId: user._id,
            communityMember: true,
            message: 'User successfully added to community'
        });
    } catch (err) {
        console.error('Error in approveCommunityJoinRequest:', err);
        return res.status(500).json({ success: false, message: 'Error approving join request.' });
    }
};

// Admin: Reject community join request (AJAX)
exports.rejectCommunityJoinRequest = async (req, res) => {
    try {
        const request = await JoinRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: 'Join request not found.' });
        request.status = 'rejected';
        await request.save();
        return res.json({ success: true, status: 'rejected' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error rejecting join request.' });
    }
};

// After approving a community join request, update the session for the user if they are logged in
exports.updateSessionCommunityMember = async (req, res) => {
    if (!req.session.user) return res.sendStatus(401);
    const user = await User.findById(req.session.user.id);
    if (user) {
        req.session.user.communityMember = user.communityMember;
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
}; 