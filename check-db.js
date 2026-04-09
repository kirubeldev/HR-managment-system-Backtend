const { User } = require('./src/models');
(async () => {
  try {
    const user = await User.findOne();
    console.log('✅ Found user:', user ? user.email : 'None');
    console.log('✅ Branch column exists');
  } catch (err) {
    console.error('❌ Error accessing User table:', err.message);
  }
  process.exit();
})();
