const { User, Role } = require('./src/models');
const bcrypt = require('bcryptjs');

async function fixUsers() {
  try {
    // 1. Ensure ADMINISTRATOR role exists (this is the one used in controllers)
    let adminRole = await Role.findOne({ where: { name: 'ADMINISTRATOR' } });
    if (!adminRole) {
      console.log('ADMINISTRATOR role not found, checking for SUPER_ADMIN...');
      adminRole = await Role.findOne({ where: { name: 'SUPER_ADMIN' } });
    }
    
    if (!adminRole) {
      console.log('No admin role found, creating ADMINISTRATOR...');
      adminRole = await Role.create({ name: 'ADMINISTRATOR' });
    }

    const password = 'Kirubel@123$';
    const hash = await bcrypt.hash(password, 12);

    // Fix Kirubel user
    const [kirubel, kCreated] = await User.findOrCreate({
      where: { email: 'kirubelmenberu399@gmail.com' },
      defaults: {
        name: 'Kirubel Menberu',
        passwordHash: hash,
        roleId: adminRole.id,
        isActive: true,
        branch: 'enkulal fabrica'
      }
    });

    if (!kCreated) {
      kirubel.passwordHash = hash;
      kirubel.roleId = adminRole.id;
      kirubel.isActive = true;
      kirubel.isDeleted = false;
      kirubel.branch = 'enkulal fabrica';
      await kirubel.save();
    }
    console.log(`✅ Kirubel user ready: kirubelmenberu399@gmail.com / ${password}`);

    // Fix Admin user
    const [admin, aCreated] = await User.findOrCreate({
      where: { email: 'admin@hrms.com' },
      defaults: {
        name: 'System Admin',
        passwordHash: hash,
        roleId: adminRole.id,
        isActive: true,
        branch: 'enkulal fabrica'
      }
    });

    if (!aCreated) {
      admin.passwordHash = hash;
      admin.roleId = adminRole.id;
      admin.isActive = true;
      admin.isDeleted = false;
      admin.branch = 'enkulal fabrica';
      await admin.save();
    }
    console.log(`✅ Admin user ready: admin@hrms.com / ${password}`);

  } catch (err) {
    console.error('❌ Fix failed:', err.message);
  } finally {
    process.exit();
  }
}

fixUsers();
