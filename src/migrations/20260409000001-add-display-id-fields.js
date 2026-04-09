'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add displayId column to users table
    try {
      await queryInterface.addColumn('users', 'displayId', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      });
    } catch (err) {
      console.log('Column users.displayId may already exist:', err.message);
    }

    // Add displayId column to employees table
    try {
      await queryInterface.addColumn('employees', 'displayId', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      });
    } catch (err) {
      console.log('Column employees.displayId may already exist:', err.message);
    }

    // Add displayId column to students table
    try {
      await queryInterface.addColumn('students', 'displayId', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      });
    } catch (err) {
      console.log('Column students.displayId may already exist:', err.message);
    }

    // Add displayId column to leave_requests table
    try {
      await queryInterface.addColumn('leave_requests', 'displayId', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      });
    } catch (err) {
      console.log('Column leave_requests.displayId may already exist:', err.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove displayId column from all tables
    await queryInterface.removeColumn('users', 'displayId');
    await queryInterface.removeColumn('employees', 'displayId');
    await queryInterface.removeColumn('students', 'displayId');
    await queryInterface.removeColumn('leave_requests', 'displayId');
  }
};
