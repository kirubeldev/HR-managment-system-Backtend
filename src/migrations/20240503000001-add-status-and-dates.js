'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('departments');
    
    // Add status to departments
    if (!tableInfo.status) {
      await queryInterface.addColumn('departments', 'status', {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false
      });
    }

    // Add endDate to departments if missing
    if (!tableInfo.endDate) {
      await queryInterface.addColumn('departments', 'endDate', {
        type: Sequelize.DATEONLY,
        allowNull: true
      });
    }

    // Add location to departments if missing
    if (!tableInfo.location) {
      await queryInterface.addColumn('departments', 'location', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    // Add description to departments if missing
    if (!tableInfo.description) {
      await queryInterface.addColumn('departments', 'description', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    // Add status to projects
    const projInfo = await queryInterface.describeTable('projects');
    if (!projInfo.status) {
      await queryInterface.addColumn('projects', 'status', {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false
      });
    }

    // Add status, startDate, and endDate to teaching_programs
    const progInfo = await queryInterface.describeTable('teaching_programs');
    if (!progInfo.status) {
      await queryInterface.addColumn('teaching_programs', 'status', {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false
      });
    }

    if (!progInfo.startDate) {
      await queryInterface.addColumn('teaching_programs', 'startDate', {
        type: Sequelize.DATEONLY,
        allowNull: true
      });
    }

    if (!progInfo.endDate) {
      await queryInterface.addColumn('teaching_programs', 'endDate', {
        type: Sequelize.DATEONLY,
        allowNull: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('departments', 'status');
    await queryInterface.removeColumn('projects', 'status');
    await queryInterface.removeColumn('teaching_programs', 'status');
    await queryInterface.removeColumn('teaching_programs', 'startDate');
    await queryInterface.removeColumn('teaching_programs', 'endDate');
    
    // Drop ENUM type if necessary (Sequelize might handle it depending on DB)
    // For Postgres, we might need to manually drop the type if it causes issues
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_departments_status";');
  }
};
