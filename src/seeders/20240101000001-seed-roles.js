'use strict';
const ROLE_IDS = {
  ADMINISTRATOR: '11111111-1111-1111-1111-000000000001',
  HR_MANAGER:    '11111111-1111-1111-1111-000000000002',
  HR_OFFICER:    '11111111-1111-1111-1111-000000000003',
  RECRUITER:     '11111111-1111-1111-1111-000000000004',
  PAYROLL_OFFICER:     '11111111-1111-1111-1111-000000000005',
  ATTENDANCE_MANAGER:  '11111111-1111-1111-1111-000000000006',
  DEPARTMENT_MANAGER:  '11111111-1111-1111-1111-000000000007',
};

module.exports = {
  ROLE_IDS,
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('roles', Object.entries(ROLE_IDS).map(([key, id]) => ({
      id,
      name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      isDeleted: false,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    })));
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
