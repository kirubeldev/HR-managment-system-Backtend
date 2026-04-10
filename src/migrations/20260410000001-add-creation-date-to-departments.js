'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add creationDate column
    await queryInterface.addColumn('departments', 'creationDate', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
    
    console.log('✅ Added creationDate column to departments table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('departments', 'creationDate');
  }
};
