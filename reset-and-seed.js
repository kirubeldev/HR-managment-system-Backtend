const { sequelize } = require('./src/models');

async function resetAndSeed() {
  try {
    console.log('🔄 Starting database reset and reseed process...');
    
    // Test connection first
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Drop all tables in correct order (respecting foreign keys)
    const tablesToDrop = [
      'audit_logs',
      'refresh_tokens',
      'role_permissions',
      'permissions',
      'users',
      'employees',
      'students',
      'leave_requests',
      'departments',
      'teaching_programs',
      'roles'
    ];
    
    console.log('🗑️ Dropping all tables...');
    for (const table of tablesToDrop) {
      try {
        await sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
        console.log(`  ✓ Dropped ${table}`);
      } catch (err) {
        console.log(`  ⚠️ ${table} may not exist: ${err.message}`);
      }
    }
    
    // Sync database to recreate tables
    console.log('📦 Syncing database to recreate tables...');
    await sequelize.sync({ force: true });
    console.log('✅ All tables recreated');
    
    // Now seed the data
    console.log('🌱 Seeding database...');
    
    // Seed roles first
    const roleData = [
      { id: '11111111-1111-1111-1111-000000000001', name: 'SUPER_ADMIN', isDeleted: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '11111111-1111-1111-1111-000000000002', name: 'ADMINISTRATOR', isDeleted: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '11111111-1111-1111-1111-000000000003', name: 'HR_MANAGER', isDeleted: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '11111111-1111-1111-1111-000000000004', name: 'HR_OFFICER', isDeleted: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '11111111-1111-1111-1111-000000000005', name: 'RECRUITER', isDeleted: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '11111111-1111-1111-1111-000000000006', name: 'PAYROLL_OFFICER', isDeleted: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '11111111-1111-1111-1111-000000000007', name: 'ATTENDANCE_MANAGER', isDeleted: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '11111111-1111-1111-1111-000000000008', name: 'DEPARTMENT_MANAGER', isDeleted: false, createdAt: new Date(), updatedAt: new Date() }
    ];
    
    for (const role of roleData) {
      await sequelize.query(`
        INSERT INTO roles (id, name, "isDeleted", "createdAt", "updatedAt")
        VALUES ('${role.id}', '${role.name}', ${role.isDeleted}, NOW(), NOW())
      `);
    }
    console.log('✅ Roles seeded');
    
    // Seed departments
    const departmentData = [
      { id: 'd1111111-1111-1111-1111-000000000001', name: 'Human Resources', location: 'Head Office', isDeleted: false },
      { id: 'd1111111-1111-1111-1111-000000000002', name: 'Finance', location: 'Head Office', isDeleted: false },
      { id: 'd1111111-1111-1111-1111-000000000003', name: 'IT', location: 'Head Office', isDeleted: false },
      { id: 'd1111111-1111-1111-1111-000000000004', name: 'Operations', location: 'Main Branch', isDeleted: false }
    ];
    
    for (const dept of departmentData) {
      await sequelize.query(`
        INSERT INTO departments (id, name, location, "isDeleted", "createdAt", "updatedAt")
        VALUES ('${dept.id}', '${dept.name}', '${dept.location}', ${dept.isDeleted}, NOW(), NOW())
      `);
    }
    console.log('✅ Departments seeded');
    
    // Seed permissions
    const permissions = [
      'create_user', 'edit_user', 'delete_user', 'view_user',
      'create_employee', 'edit_employee', 'delete_employee', 'view_employee',
      'manage_roles', 'manage_permissions',
      'view_department', 'create_department', 'edit_department', 'delete_department',
      'view_audit_logs',
      'view_student', 'create_student', 'edit_student', 'delete_student',
      'view_program', 'create_program', 'edit_program', 'delete_program',
      'view_level', 'create_level', 'edit_level', 'delete_level'
    ];
    
    const permissionIds = {};
    for (let i = 0; i < permissions.length; i++) {
      const permId = `p1111111-1111-1111-1111-${String(i).padStart(12, '0')}`;
      permissionIds[permissions[i]] = permId;
      await sequelize.query(`
        INSERT INTO permissions (id, name, "createdAt", "updatedAt")
        VALUES ('${permId}', '${permissions[i]}', NOW(), NOW())
      `);
    }
    console.log('✅ Permissions seeded');
    
    // Assign all permissions to ADMINISTRATOR role
    const adminRoleId = '11111111-1111-1111-1111-000000000002';
    for (const permId of Object.values(permissionIds)) {
      await sequelize.query(`
        INSERT INTO role_permissions ("roleId", "permissionId", "createdAt", "updatedAt")
        VALUES ('${adminRoleId}', '${permId}', NOW(), NOW())
      `);
    }
    console.log('✅ Role permissions assigned');
    
    console.log('🎉 Database reset and seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('  - All tables dropped and recreated');
    console.log('  - 8 roles created (including ADMINISTRATOR)');
    console.log('  - 4 departments created');
    console.log(`  - ${permissions.length} permissions created`);
    console.log('  - All permissions assigned to ADMINISTRATOR role');
    console.log('  - Users table is empty (ready for admin creation)');
    
    process.exit(0);
  } catch (err) {
    console.log('❌ Error during reset and seed:', err);
    process.exit(1);
  }
}

resetAndSeed();
