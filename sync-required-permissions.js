const { Role, Permission, sequelize } = require('./src/models');
const crypto = require('crypto');

async function syncPermissions() {
  try {
    const requiredPermissions = [
      'all_permissions',
      'view_dashboard',
      'view_user',
      'create_user',
      'edit_user',
      'delete_user',
      'view_employee',
      'create_employee',
      'edit_employee',
      'delete_employee',
      'view_department',
      'create_department',
      'edit_department',
      'delete_department',
      'manage_roles',
      'manage_permissions',
      'view_audit_logs',
      'view_trainee',
      'view_child',
      'view_program',
      'create_program',
      'edit_program',
      'delete_program',
      'view_leave_request',
      'manage_leave_requests'
    ];

    console.log('Checking permissions...');
    for (const name of requiredPermissions) {
      const [perm, created] = await Permission.findOrCreate({
        where: { name },
        defaults: { id: crypto.randomUUID(), name }
      });
      if (created) console.log(`+ Created permission: ${name}`);
    }

    const adminRoles = await Role.findAll({
      where: {
        name: ['SUPER_ADMIN', 'ADMINISTRATOR', 'Admin']
      }
    });

    const allPerms = await Permission.findAll();
    for (const role of adminRoles) {
      await role.setPermissions(allPerms);
      console.log(`✅ Synced all ${allPerms.length} permissions to role: ${role.name}`);
    }

  } catch (err) {
    console.error('❌ Sync failed:', err.message);
  } finally {
    process.exit();
  }
}

syncPermissions();
