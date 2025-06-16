const mongoose = require('mongoose');
const User = require('./models/User');
const Club = require('./models/Club');

async function migrateUserClubs() {
  await mongoose.connect('mongodb+srv://marmoushhh:Z7Ev5NEqMb4cCHFX@cluster0.2onzk6d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'); // <-- YOUR DB URI

  const users = await User.find({ clubs: { $elemMatch: { $type: 'string' } } });
  for (const user of users) {
    const newClubs = [];
    for (const clubName of user.clubs) {
      if (typeof clubName === 'string') {
        const clubDoc = await Club.findOne({ name: new RegExp('^' + clubName + '$', 'i') });
        if (clubDoc) {
          newClubs.push({ club: clubDoc._id, joinedAt: new Date() });
        } else {
          console.warn(`Club not found for name: ${clubName}`);
        }
      } else if (clubName && clubName.club) {
        newClubs.push(clubName);
      }
    }
    user.clubs = newClubs;
    await user.save();
    console.log(`Migrated user ${user.username}`);
  }
  mongoose.disconnect();
}

migrateUserClubs(); 