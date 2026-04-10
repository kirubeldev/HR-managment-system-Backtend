const sequelize = require('./config/database');
const { User } = require('./models');

async function fixUserDisplayIds() {
  try {
    console.log('Updating user display IDs from DEP to USR...');
    
    // Get all users with DEP prefix
    const users = await User.findAll({
      where: {
        displayId: {
          [sequelize.Sequelize.Op.like]: 'DEP%'
        }
      }
    });
    
    console.log(`Found ${users.length} users with DEP prefix`);
    
    for (const user of users) {
      const oldDisplayId = user.displayId;
      const newDisplayId = oldDisplayId.replace('DEP', 'USR');
      
      await user.update({ displayId: newDisplayId });
      console.log(`Updated: ${oldDisplayId} -> ${newDisplayId}`);
    }
    
    console.log('✅ User display IDs updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating user display IDs:', err.message);
    process.exit(1);
  }
}

fixUserDisplayIds();
