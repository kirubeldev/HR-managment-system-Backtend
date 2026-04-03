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
  view_student:       '22222222-2222-2222-2222-000000000016',
  create_student:     '22222222-2222-2222-2222-000000000017',
  edit_student:       '22222222-2222-2222-2222-000000000018',
  delete_student:     '22222222-2222-2222-2222-000000000019',
  view_program:       '22222222-2222-2222-2222-000000000020',
  create_program:     '22222222-2222-2222-2222-000000000021',
  edit_program:       '22222222-2222-2222-2222-000000000022',
  delete_program:     '22222222-2222-2222-2222-000000000023',
  view_level:         '22222222-2222-2222-2222-000000000024',
  create_level:       '22222222-2222-2222-2222-000000000025',
  edit_level:         '22222222-2222-2222-2222-000000000026',
  delete_level:       '22222222-2222-2222-2222-000000000027',
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
