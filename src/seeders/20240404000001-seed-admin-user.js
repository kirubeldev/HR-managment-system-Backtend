'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, ensure admin role exists
    let adminRole = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'admin' LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );

    let adminRoleId;
    
    if (!adminRole || adminRole.length === 0) {
      // Create admin role with a new UUID
      adminRoleId = '11111111-1111-1111-1111-000000000099';
      try {
        await queryInterface.bulkInsert('roles', [{
          id: adminRoleId,
          name: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        }]);
        console.log('✅ Admin role created');
      } catch (e) {
        // Role might already exist with different ID
        const existingRole = await queryInterface.sequelize.query(
          "SELECT id FROM roles WHERE name = 'admin' LIMIT 1",
          { type: Sequelize.QueryTypes.SELECT }
        );
        if (existingRole && existingRole.length > 0) {
          adminRoleId = existingRole[0].id;
          console.log('Using existing admin role');
        }
      }
    } else {
      adminRoleId = adminRole[0].id;
    }

    // Check if admin user already exists
    const existingAdmin = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'admin@hrms.com' LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingAdmin && existingAdmin.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash('Admin@1234', 12);

    // Create the admin user
    const userId = '11111111-1111-1111-1111-000000000000';
    
    await queryInterface.bulkInsert('users', [{
      id: userId,
      email: 'admin@hrms.com',
      name: 'System Administrator',
      passwordHash: passwordHash,
      roleId: adminRoleId,
      isActive: true,
      resetToken: null,
      resetTokenExpiry: null,
      otp: null,
      otpExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    console.log('✅ Admin user created successfully:');
    console.log('   Email: admin@hrms.com');
    console.log('   Password: Admin@1234');
    console.log('   Role: admin');
  },

  async down(queryInterface, Sequelize) {
    // Remove the admin user
    await queryInterface.bulkDelete('users', {
      email: 'admin@hrms.com'
    });
    console.log('Admin user removed');
  }
};
