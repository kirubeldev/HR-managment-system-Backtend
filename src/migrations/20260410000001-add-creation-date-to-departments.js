'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if column exists first
    const tableInfo = await queryInterface.describeTable('departments');
    if (!tableInfo.creationDate) {
      await queryInterface.addColumn('departments', 'creationDate', {
        type: Sequelize.DATEONLY,
        allowNull: true
      });
      console.log('✅ Added creationDate column to departments table');
    } else {
      console.log('ℹ️ creationDate column already exists, skipping');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('departments', 'creationDate');
  }
};
