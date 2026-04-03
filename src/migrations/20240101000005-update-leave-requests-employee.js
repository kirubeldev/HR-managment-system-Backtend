'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, drop the foreign key constraint
    await queryInterface.removeConstraint('leave_requests', 'leave_requests_studentId_fkey');
    
    // Rename the column from studentId to employeeId
    await queryInterface.renameColumn('leave_requests', 'studentId', 'employeeId');
    
    // Add the new foreign key constraint to employees table
    await queryInterface.addConstraint('leave_requests', {
      fields: ['employeeId'],
      type: 'foreign key',
      name: 'leave_requests_employeeId_fkey',
      references: {
        table: 'employees',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverse the changes
    await queryInterface.removeConstraint('leave_requests', 'leave_requests_employeeId_fkey');
    
    // Rename back to studentId
    await queryInterface.renameColumn('leave_requests', 'employeeId', 'studentId');
    
    // Add back the original foreign key constraint
    await queryInterface.addConstraint('leave_requests', {
      fields: ['studentId'],
      type: 'foreign key',
      name: 'leave_requests_studentId_fkey',
      references: {
        table: 'students',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
};
