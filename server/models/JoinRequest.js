const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    club: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    type: { type: String, enum: ['club', 'community'], default: 'club' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JoinRequest', joinRequestSchema); 