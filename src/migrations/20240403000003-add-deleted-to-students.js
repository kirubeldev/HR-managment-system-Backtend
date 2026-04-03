'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableColumns = await queryInterface.describeTable('students');
    
    if (!tableColumns['isDeleted']) {
      await queryInterface.addColumn('students', 'isDeleted', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      });
    }

    if (!tableColumns['deletedAt']) {
      await queryInterface.addColumn('students', 'deletedAt', {
        type: Sequelize.DATE,
        allowNull: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableColumns = await queryInterface.describeTable('students');
    
    if (tableColumns['isDeleted']) {
      await queryInterface.removeColumn('students', 'isDeleted');
    }
    if (tableColumns['deletedAt']) {
      await queryInterface.removeColumn('students', 'deletedAt');
    }
  }
};
