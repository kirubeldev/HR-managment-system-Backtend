'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add branch to employees
    await queryInterface.addColumn('employees', 'branch', {
      type: Sequelize.ENUM('enkulal fabrica', 'bole center'),
      allowNull: true,
    });

    // Add branch to users
    await queryInterface.addColumn('users', 'branch', {
      type: Sequelize.ENUM('enkulal fabrica', 'bole center'),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // We must drop the columns first
    await queryInterface.removeColumn('employees', 'branch');
    await queryInterface.removeColumn('users', 'branch');

    // ENUM types are created in Postgres and should be dropped
    // However, Sequelize doesn't automatically drop ENUMs on removeColumn
    // So we can manually drop the ENUM types in raw query if we wanted to be perfectly clean
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_employees_branch";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_branch";');
  }
};
