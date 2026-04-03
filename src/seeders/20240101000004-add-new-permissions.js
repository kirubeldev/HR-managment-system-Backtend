'use strict';

const newPermissions = [
  {
    id: '22222222-2222-2222-2222-000000000016',
    name: 'view_student',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22222222-2222-2222-2222-000000000017',
    name: 'create_student',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22222222-2222-2222-2222-000000000018',
    name: 'edit_student',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22222222-2222-2222-2222-000000000019',
    name: 'delete_student',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22222222-2222-2222-2222-000000000020',
    name: 'view_program',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22222222-2222-2222-2222-000000000021',
    name: 'create_program',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22222222-2222-2222-2222-000000000022',
    name: 'edit_program',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22222222-2222-2222-2222-000000000023',
    name: 'delete_program',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22222222-2222-2222-2222-000000000024',
    name: 'view_level',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22222222-2222-2222-2222-000000000025',
    name: 'create_level',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22222222-2222-2222-2222-000000000026',
    name: 'edit_level',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22222222-2222-2222-2222-000000000027',
    name: 'delete_level',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('permissions', newPermissions);
  },
  async down(queryInterface) {
    const permissionNames = newPermissions.map(p => p.name);
    await queryInterface.bulkDelete('permissions', {
      name: permissionNames
    });
  }
};
