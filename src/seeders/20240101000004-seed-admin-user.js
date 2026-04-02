'use strict';
const bcrypt = require('bcryptjs');
const { ROLE_IDS } = require('./20240101000001-seed-roles');

module.exports = {
  async up(queryInterface) {
    const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
    const email = process.env.ADMIN_EMAIL || 'admin@hrms.com';
    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    await queryInterface.bulkInsert('users', [{
      id: '33333333-3333-3333-3333-000000000001',
      email,
      passwordHash,
      roleId: ROLE_IDS.ADMINISTRATOR,
      isActive: true,
      resetToken: null,
      resetTokenExpiry: null,
      isDeleted: false,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    }]);

    console.log(`\n✅ Super Admin created:\n   Email: ${email}\n   Password: ${password}\n`);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
