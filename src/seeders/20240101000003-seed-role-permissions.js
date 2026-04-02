'use strict';
const { ROLE_IDS } = require('./20240101000001-seed-roles');
const { PERM_IDS } = require('./20240101000002-seed-permissions');

// Administrator gets ALL permissions
// HR Manager gets most except manage_permissions
// HR Officer gets view + edit employees/departments
const rolePermMap = {
  [ROLE_IDS.ADMINISTRATOR]: Object.values(PERM_IDS),
  [ROLE_IDS.HR_MANAGER]: [
    PERM_IDS.view_user, PERM_IDS.create_user, PERM_IDS.edit_user,
    PERM_IDS.create_employee, PERM_IDS.edit_employee, PERM_IDS.view_employee, PERM_IDS.delete_employee,
    PERM_IDS.view_department, PERM_IDS.create_department, PERM_IDS.edit_department,
    PERM_IDS.view_audit_logs,
  ],
  [ROLE_IDS.HR_OFFICER]: [
    PERM_IDS.view_employee, PERM_IDS.edit_employee, PERM_IDS.create_employee,
    PERM_IDS.view_department,
  ],
  [ROLE_IDS.RECRUITER]: [PERM_IDS.view_employee, PERM_IDS.create_employee, PERM_IDS.edit_employee],
  [ROLE_IDS.PAYROLL_OFFICER]: [PERM_IDS.view_employee],
  [ROLE_IDS.ATTENDANCE_MANAGER]: [PERM_IDS.view_employee],
  [ROLE_IDS.DEPARTMENT_MANAGER]: [PERM_IDS.view_employee, PERM_IDS.view_department],
};

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = [];
    for (const [roleId, permIds] of Object.entries(rolePermMap)) {
      for (const permissionId of permIds) {
        rows.push({ roleId, permissionId, createdAt: now, updatedAt: now });
      }
    }
    await queryInterface.bulkInsert('role_permissions', rows);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  },
};
