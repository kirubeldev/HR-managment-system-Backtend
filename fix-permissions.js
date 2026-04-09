const { Role, Permission, sequelize } = require('./src/models');

async function fixPermissions() {
  try {
    console.log('--- LINKING ALL PERMISSIONS TO ADMIN ROLES ---');
    
    const perms = await Permission.findAll();
    const adminRoles = await Role.findAll({
      where: {
        name: ['admin', 'Administrator', 'Super Admin', 'ADMINISTRATOR']
      }
    });

    if (adminRoles.length === 0) {
      console.log('No admin roles found to update!');
      return;
    }

    for (const role of adminRoles) {
      console.log(`Updating permissions for role: ${role.name}`);
      await role.setPermissions(perms);
      console.log(`✅ Linked ${perms.length} permissions to ${role.name}`);
    }

    console.log('--- Permission fix completed ---');
  } catch (err) {
    console.error('❌ Permission fix failed:', err.message);
  } finally {
    process.exit();
  }
}

fixPermissions();
