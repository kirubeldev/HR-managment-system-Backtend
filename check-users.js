const { sequelize, User, Role } = require('./src/models');

(async () => {
  try {
    console.log('Checking database users...');
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    const users = await User.findAll({
      include: [{ model: Role, as: 'role' }]
    });
    
    if (users.length === 0) {
      console.log('⚠️ No users found in the database.');
    } else {
      console.log(`Found ${users.length} users:`);
      users.forEach(u => {
        console.log(`- Email: ${u.email}, Active: ${u.isActive}, Role: ${u.role ? u.role.name : 'None'}`);
      });
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error checking users:', err.message);
    process.exit(1);
  }
})();
