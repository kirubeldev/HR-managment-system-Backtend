'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('departments');
    
    if (!tableInfo.location) {
      await queryInterface.addColumn('departments', 'location', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    
    if (!tableInfo.status) {
      await queryInterface.addColumn('departments', 'status', {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false
      });
    }

    if (!tableInfo.endDate) {
      await queryInterface.addColumn('departments', 'endDate', {
        type: Sequelize.DATEONLY,
        allowNull: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // ... 
  }
};
