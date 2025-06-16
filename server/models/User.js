const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '/img/default-avatar.jpg' },
    clubs: [{
        club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
        joinedAt: { type: Date, default: Date.now }
    }],
    communityMember: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema); 