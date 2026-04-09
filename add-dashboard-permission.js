const { Permission, Role, sequelize } = require('./src/models');

async function addDashboardPermission() {
  try {
    console.log('--- ADDING VIEW_DASHBOARD PERMISSION ---');
    
    // 1. Create the permission
    const [perm, created] = await Permission.findOrCreate({
      where: { name: 'view_dashboard' },
      defaults: { name: 'view_dashboard' }
    });
    
    if (created) {
      console.log('✅ Created permission: view_dashboard');
    } else {
      console.log('ℹ️ Permission view_dashboard already exists');
    }

    // 2. Link to ALL existing roles
    const allRoles = await Role.findAll({ where: { isDeleted: false } });
    console.log(`Linking to ${allRoles.length} roles...`);
    
    for (const role of allRoles) {
      await role.addPermission(perm);
      console.log(`  ✓ Linked to role: ${role.name}`);
    }

    console.log('--- Done ---');
  } catch (err) {
    console.log('❌ Error:', err.message);
  } finally {
    process.exit();
  }
}

addDashboardPermission();
