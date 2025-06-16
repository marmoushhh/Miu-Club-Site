const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: false // Not required for community posts
    },
    community: {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
        required: true
    },
    media: {
        type: String, // URL to media file
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [commentSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Post', postSchema); 