const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function updateDefaultAvatars() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Update all users with empty avatars or old default path
        const result = await User.updateMany(
            { $or: [
                { avatar: '' },
                { avatar: '/img/avatar/default.jpg' },
                { avatar: '/img/default-avatar.png' }
            ]},
            { $set: { avatar: '/img/default-avatar.jpg' } }
        );

        console.log(`Updated ${result.modifiedCount} users with default avatar`);
        
        // Verify the update
        const usersWithEmptyAvatar = await User.countDocuments({ 
            $or: [
                { avatar: '' },
                { avatar: '/img/avatar/default.jpg' },
                { avatar: '/img/default-avatar.png' }
            ]
        });
        console.log(`Users still with empty or old avatar: ${usersWithEmptyAvatar}`);

    } catch (error) {
        console.error('Error updating default avatars:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the migration
updateDefaultAvatars(); 