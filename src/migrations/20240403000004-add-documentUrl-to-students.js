'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableColumns = await queryInterface.describeTable('students');
    
    if (!tableColumns['documentUrl']) {
      await queryInterface.addColumn('students', 'documentUrl', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableColumns = await queryInterface.describeTable('students');
    
    if (tableColumns['documentUrl']) {
      await queryInterface.removeColumn('students', 'documentUrl');
    }
  }
};
