'use strict';
const PERM_IDS = {
  create_user:        '22222222-2222-2222-2222-000000000001',
  edit_user:          '22222222-2222-2222-2222-000000000002',
  delete_user:        '22222222-2222-2222-2222-000000000003',
  view_user:          '22222222-2222-2222-2222-000000000004',
  create_employee:    '22222222-2222-2222-2222-000000000005',
  edit_employee:      '22222222-2222-2222-2222-000000000006',
  delete_employee:    '22222222-2222-2222-2222-000000000007',
  view_employee:      '22222222-2222-2222-2222-000000000008',
  manage_roles:       '22222222-2222-2222-2222-000000000009',
  manage_permissions: '22222222-2222-2222-2222-000000000010',
  view_department:    '22222222-2222-2222-2222-000000000011',
  create_department:  '22222222-2222-2222-2222-000000000012',
  edit_department:    '22222222-2222-2222-2222-000000000013',
  delete_department:  '22222222-2222-2222-2222-000000000014',
  view_audit_logs:    '22222222-2222-2222-2222-000000000015',
};

module.exports = {
  PERM_IDS,
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('permissions', Object.entries(PERM_IDS).map(([name, id]) => ({
      id, name, createdAt: now, updatedAt: now,
    })));
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
