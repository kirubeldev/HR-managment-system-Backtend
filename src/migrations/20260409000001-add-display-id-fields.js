'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add displayId column to users table
    await queryInterface.addColumn('users', 'displayId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    // Add displayId column to employees table
    await queryInterface.addColumn('employees', 'displayId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    // Add displayId column to students table
    await queryInterface.addColumn('students', 'displayId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    // Add displayId column to leave_requests table
    await queryInterface.addColumn('leave_requests', 'displayId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove displayId column from all tables
    await queryInterface.removeColumn('users', 'displayId');
    await queryInterface.removeColumn('employees', 'displayId');
    await queryInterface.removeColumn('students', 'displayId');
    await queryInterface.removeColumn('leave_requests', 'displayId');
  }
};
