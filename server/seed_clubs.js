const mongoose = require('mongoose');
const Club = require('./models/Club');

const clubs = [
  { name: 'ACPC', description: 'ACPC Club' },
  { name: 'Enactus', description: 'Enactus Club' },
  { name: 'TEDx', description: 'TEDx Club' },
  { name: 'MUN', description: 'Model United Nations' },
  { name: 'Gamers Legacy', description: 'Gamers Legacy Club' },
  { name: 'Tunners', description: 'Tunners Club' },
  { name: 'El Warsha', description: 'El Warsha Club' },
  { name: 'MOVE', description: 'MOVE Club' },
  { name: 'IHEPC', description: 'IHEPC Club' }
];

async function seedClubs() {
  await mongoose.connect('mongodb+srv://marmoushhh:Z7Ev5NEqMb4cCHFX@cluster0.2onzk6d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'); // <-- YOUR DB URI

  for (const club of clubs) {
    const exists = await Club.findOne({ name: club.name });
    if (!exists) {
      await Club.create(club);
      console.log(`Inserted club: ${club.name}`);
    } else {
      console.log(`Club already exists: ${club.name}`);
    }
  }
  mongoose.disconnect();
}

seedClubs(); 