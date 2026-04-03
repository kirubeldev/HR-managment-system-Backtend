'use strict';

const exportPermissions = [
  {
    id: '22222222-2222-2222-2222-000000000028',
    name: 'export_students',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22222222-2222-2222-2222-000000000029',
    name: 'export_employees',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22222222-2222-2222-2222-000000000030',
    name: 'export_leaves',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('permissions', exportPermissions);
  },
  async down(queryInterface) {
    const permissionNames = exportPermissions.map(p => p.name);
    await queryInterface.bulkDelete('permissions', {
      name: permissionNames
    });
  }
};
