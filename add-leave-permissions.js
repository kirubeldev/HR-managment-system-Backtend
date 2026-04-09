const { Permission, Role, sequelize } = require('./src/models');

async function addLeavePermissions() {
  try {
    console.log('--- ADDING LEAVE REQUEST PERMISSIONS ---');
    
    const permissionsToAdd = [
      { name: 'view_leave_request' },
      { name: 'create_leave_request' },
      { name: 'edit_leave_request' },
      { name: 'delete_leave_request' }
    ];

    for (const permData of permissionsToAdd) {
      const [perm, created] = await Permission.findOrCreate({
        where: { name: permData.name },
        defaults: permData
      });
      if (created) {
        console.log(`✅ Created permission: ${permData.name}`);
      } else {
        console.log(`ℹ️ Permission already exists: ${permData.name}`);
      }
    }

    // Link them to Administrators
    const perms = await Permission.findAll({
      where: { name: permissionsToAdd.map(p => p.name) }
    });
    
    const adminRoles = await Role.findAll({
      where: {
        name: ['admin', 'Administrator', 'Super Admin', 'ADMINISTRATOR', 'SUPER_ADMIN']
      }
    });

    for (const role of adminRoles) {
      await role.addPermissions(perms);
      console.log(`✅ Linked leave permissions to role: ${role.name}`);
    }

    console.log('--- Done ---');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit();
  }
}

addLeavePermissions();
