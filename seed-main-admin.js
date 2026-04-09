const { User, Role } = require('./src/models');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    // 1. Ensure Admin Role exists
    let adminRole = await Role.findOne({ where: { name: 'Admin' } });
    if (!adminRole) {
      console.log('Admin role not found, creating it...');
      adminRole = await Role.create({ name: 'Admin' });
    }

    // 2. Hash Password
    const password = 'Admin@1234';
    const email = 'admin@hrms.com';
    const hash = await bcrypt.hash(password, 12);

    // 3. Create or update User
    const [user, created] = await User.findOrCreate({
      where: { email: email },
      defaults: {
        name: 'System Admin',
        passwordHash: hash,
        roleId: adminRole.id,
        isActive: true,
        branch: 'Main HQ'
      }
    });

    if (!created) {
      console.log('Admin user already exists, updating credentials...');
      user.passwordHash = hash;
      user.roleId = adminRole.id;
      user.isActive = true;
      await user.save();
    }

    console.log(`✅ Admin user ${email} is ready.`);
  } catch (err) {
    console.log('❌ Seeding failed:', err.message);
  } finally {
    process.exit();
  }
}

seedAdmin();
