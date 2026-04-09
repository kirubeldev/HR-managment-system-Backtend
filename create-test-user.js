const { User, Role } = require('./src/models');
const bcrypt = require('bcryptjs');

async function createUser() {
  try {
    const allRoles = await Role.findAll();
    console.log('Available Roles in DB:', allRoles.map(r => r.name).join(', '));
    
    // Fuzzy match for any role containing 'admin'
    let role = allRoles.find(r => r.name.toLowerCase().includes('admin'));
    
    if (!role) {
      console.log('No admin-like role found, picking the first available role...');
      role = allRoles[0];
    }

    if (!role) {
      throw new Error('No roles exist in the database at all');
    }
    
    console.log(`Using role: ${role.name} (${role.id})`);
    await performCreate(role);
  } catch (err) {
    console.error('❌ Creation failed:', err.message);
    if (err.errors) console.error(err.errors.map(e => e.message).join(', '));
  } finally {
    process.exit();
  }
}

async function performCreate(role) {
  const hash = await bcrypt.hash('Kirubel@123$', 12);
  const [user, created] = await User.findOrCreate({
    where: { email: 'kirubelmenberu399@gmail.com' },
    defaults: {
      name: 'Kirubel Memberu',
      passwordHash: hash,
      roleId: role.id,
      isActive: true,
      branch: 'enkulal fabrica' // Adding a branch to ensure dashboard queries work
    }
  });
  
  if (!created) {
    console.log('User already exists, updating password and status...');
    user.passwordHash = hash;
    user.isActive = true;
    user.roleId = role.id;
    await user.save();
  }
  
  console.log('✅ User prepared:', user.email);
}

createUser();
