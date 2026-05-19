const { Role, Permission, sequelize } = require('./src/models');

async function grantAllPermissions() {
  try {
    const adminRoles = await Role.findAll({
      where: {
        name: ['SUPER_ADMIN', 'ADMINISTRATOR', 'Admin']
      }
    });

    if (adminRoles.length === 0) {
      console.log('No admin roles found to grant permissions to.');
      return;
    }

    const allPermissions = await Permission.findAll();
    console.log(`Found ${allPermissions.length} permissions in the database.`);

    for (const role of adminRoles) {
      await role.setPermissions(allPermissions);
      console.log(`✅ Granted all permissions to role: ${role.name}`);
    }

  } catch (err) {
    console.error('❌ Failed to grant permissions:', err.message);
  } finally {
    process.exit();
  }
}

grantAllPermissions();
