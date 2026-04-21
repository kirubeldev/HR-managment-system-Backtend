const { sequelize } = require('./src/models');
const bcrypt = require('bcryptjs');

async function seedAllTables() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // 1. Seed Roles
    console.log('\n📋 Seeding Roles...');
    const roles = [
      { id: '11111111-1111-1111-1111-000000000001', name: 'SUPER_ADMIN', isDeleted: false },
      { id: '11111111-1111-1111-1111-000000000002', name: 'ADMINISTRATOR', isDeleted: false },
      { id: '11111111-1111-1111-1111-000000000003', name: 'HR_MANAGER', isDeleted: false },
      { id: '11111111-1111-1111-1111-000000000004', name: 'HR_OFFICER', isDeleted: false },
      { id: '11111111-1111-1111-1111-000000000005', name: 'RECRUITER', isDeleted: false },
      { id: '11111111-1111-1111-1111-000000000006', name: 'PAYROLL_OFFICER', isDeleted: false },
      { id: '11111111-1111-1111-1111-000000000007', name: 'ATTENDANCE_MANAGER', isDeleted: false },
      { id: '11111111-1111-1111-1111-000000000008', name: 'DEPARTMENT_MANAGER', isDeleted: false }
    ];
    
    for (const role of roles) {
      await sequelize.query(`
        INSERT INTO roles (id, name, "isDeleted", "createdAt", "updatedAt")
        VALUES ('${role.id}', '${role.name}', ${role.isDeleted}, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `);
    }
    console.log(`✅ ${roles.length} roles seeded`);
    
    // 2. Seed Departments
    console.log('\n🏢 Seeding Departments...');
    const departments = [
      { id: 'd1111111-1111-1111-1111-000000000001', name: 'Human Resources', location: 'Head Office', description: 'HR Department' },
      { id: 'd1111111-1111-1111-1111-000000000002', name: 'Finance', location: 'Head Office', description: 'Finance Department' },
      { id: 'd1111111-1111-1111-1111-000000000003', name: 'Information Technology', location: 'Tech Building', description: 'IT Department' },
      { id: 'd1111111-1111-1111-1111-000000000004', name: 'Operations', location: 'Main Branch', description: 'Operations Department' },
      { id: 'd1111111-1111-1111-1111-000000000005', name: 'Marketing', location: 'Head Office', description: 'Marketing Department' }
    ];
    
    for (const dept of departments) {
      await sequelize.query(`
        INSERT INTO departments (id, name, location, description, "isDeleted", "createdAt", "updatedAt")
        VALUES ('${dept.id}', '${dept.name}', '${dept.location}', '${dept.description}', false, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `);
    }
    console.log(`✅ ${departments.length} departments seeded`);
    
    // 3. Seed Permissions
    console.log('\n🔐 Seeding Permissions...');
    const permissions = [
      'create_user', 'edit_user', 'delete_user', 'view_user',
      'create_employee', 'edit_employee', 'delete_employee', 'view_employee',
      'create_role', 'edit_role', 'delete_role', 'view_role', 'manage_roles',
      'create_permission', 'edit_permission', 'delete_permission', 'view_permission', 'manage_permissions',
      'view_department', 'create_department', 'edit_department', 'delete_department',
      'view_audit_logs',
      'view_student', 'create_student', 'edit_student', 'delete_student',
      'view_program', 'create_program', 'edit_program', 'delete_program',
      'view_level', 'create_level', 'edit_level', 'delete_level',
      'manage_leave_requests', 'approve_leave', 'view_leave_reports'
    ];
    
    const permissionIds = {};
    for (let i = 0; i < permissions.length; i++) {
      const permId = `p1111111-1111-1111-1111-${String(i).padStart(12, '0')}`;
      permissionIds[permissions[i]] = permId;
      await sequelize.query(`
        INSERT INTO permissions (id, name, "createdAt", "updatedAt")
        VALUES ('${permId}', '${permissions[i]}', NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `);
    }
    console.log(`✅ ${permissions.length} permissions seeded`);
    
    // 4. Assign permissions to ADMINISTRATOR role
    console.log('\n🔗 Assigning permissions to ADMINISTRATOR role...');
    const adminRoleId = '11111111-1111-1111-1111-000000000002';
    for (const permId of Object.values(permissionIds)) {
      await sequelize.query(`
        INSERT INTO role_permissions ("roleId", "permissionId", "createdAt", "updatedAt")
        VALUES ('${adminRoleId}', '${permId}', NOW(), NOW())
        ON CONFLICT DO NOTHING
      `);
    }
    console.log('✅ All permissions assigned to ADMINISTRATOR role');
    
    // 5. Seed Teaching Programs
    console.log('\n📚 Seeding Teaching Programs...');
    const programs = [
      { id: 'prog1111-1111-1111-1111-000000000001', name: 'Computer Science', description: 'BS in Computer Science', duration: '4 years' },
      { id: 'prog1111-1111-1111-1111-000000000002', name: 'Business Administration', description: 'BBA Program', duration: '4 years' },
      { id: 'prog1111-1111-1111-1111-000000000003', name: 'Engineering', description: 'Bachelor of Engineering', duration: '5 years' }
    ];
    
    for (const prog of programs) {
      await sequelize.query(`
        INSERT INTO teaching_programs (id, name, description, duration, status, "createdAt", "updatedAt")
        VALUES ('${prog.id}', '${prog.name}', '${prog.description}', '${prog.duration}', 'active', NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `);
    }
    console.log(`✅ ${programs.length} teaching programs seeded`);
    
    // 6. Seed Sample Employees
    console.log('\n👔 Seeding Sample Employees...');
    const employees = [
      { id: 'e1111111-1111-1111-1111-000000000001', firstName: 'John', lastName: 'Doe', email: 'john.doe@company.com', phone: '+1234567890', departmentId: departments[0].id, position: 'HR Manager', status: 'active' },
      { id: 'e1111111-1111-1111-1111-000000000002', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@company.com', phone: '+1234567891', departmentId: departments[1].id, position: 'Finance Manager', status: 'active' },
      { id: 'e1111111-1111-1111-1111-000000000003', firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@company.com', phone: '+1234567892', departmentId: departments[2].id, position: 'IT Manager', status: 'active' }
    ];
    
    for (const emp of employees) {
      await sequelize.query(`
        INSERT INTO employees (id, "firstName", "lastName", email, phone, "departmentId", position, status, "isDeleted", "createdAt", "updatedAt")
        VALUES ('${emp.id}', '${emp.firstName}', '${emp.lastName}', '${emp.email}', '${emp.phone}', '${emp.departmentId}', '${emp.position}', '${emp.status}', false, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `);
    }
    console.log(`✅ ${employees.length} employees seeded`);
    
    // 7. Seed Sample Students
    console.log('\n🎓 Seeding Sample Students...');
    const students = [
      { id: 's1111111-1111-1111-1111-000000000001', firstName: 'Alice', lastName: 'Johnson', email: 'alice.j@university.edu', programId: programs[0].id, level: 'Year 2', status: 'active' },
      { id: 's1111111-1111-1111-1111-000000000002', firstName: 'Charlie', lastName: 'Brown', email: 'charlie.b@university.edu', programId: programs[1].id, level: 'Year 3', status: 'active' }
    ];
    
    for (const student of students) {
      await sequelize.query(`
        INSERT INTO students (id, "firstName", "lastName", email, "programId", level, status, "createdAt", "updatedAt")
        VALUES ('${student.id}', '${student.firstName}', '${student.lastName}', '${student.email}', '${student.programId}', '${student.level}', '${student.status}', NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `);
    }
    console.log(`✅ ${students.length} students seeded`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Seeding Summary:');
    console.log('  • 8 Roles created');
    console.log('  • 5 Departments created');
    console.log(`  • ${permissions.length} Permissions created`);
    console.log('  • All permissions assigned to ADMINISTRATOR');
    console.log('  • 3 Teaching Programs created');
    console.log('  • 3 Employees created');
    console.log('  • 2 Students created');
    console.log('  • Users table: Empty (ready for admin creation)');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seedAllTables();
