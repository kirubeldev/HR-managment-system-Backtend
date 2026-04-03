'use strict';

const { ROLE_IDS } = require('./20240101000001-seed-roles');

const newPermissionIds = [
  '22222222-2222-2222-2222-000000000016', // view_student
  '22222222-2222-2222-2222-000000000017', // create_student
  '22222222-2222-2222-2222-000000000018', // edit_student
  '22222222-2222-2222-2222-000000000019', // delete_student
  '22222222-2222-2222-2222-000000000020', // view_program
  '22222222-2222-2222-2222-000000000021', // create_program
  '22222222-2222-2222-2222-000000000022', // edit_program
  '22222222-2222-2222-2222-000000000023', // delete_program
  '22222222-2222-2222-2222-000000000024', // view_level
  '22222222-2222-2222-2222-000000000025', // create_level
  '22222222-2222-2222-2222-000000000026', // edit_level
  '22222222-2222-2222-2222-000000000027', // delete_level
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = newPermissionIds.map(permissionId => ({
      roleId: ROLE_IDS.ADMINISTRATOR,
      permissionId,
      createdAt: now,
      updatedAt: now
    }));
    
    await queryInterface.bulkInsert('role_permissions', rows);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('role_permissions', {
      roleId: ROLE_IDS.ADMINISTRATOR,
      permissionId: newPermissionIds
    });
  }
};
