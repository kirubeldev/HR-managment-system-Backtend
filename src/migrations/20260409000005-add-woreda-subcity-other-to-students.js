'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add woredaOther column if it doesn't exist
    try {
      await queryInterface.addColumn('students', 'woredaOther', {
        type: Sequelize.STRING,
        allowNull: true
      });
    } catch (err) {
      console.log('woredaOther column may already exist:', err.message);
    }
    
    // Add subcityOther column if it doesn't exist
    try {
      await queryInterface.addColumn('students', 'subcityOther', {
        type: Sequelize.STRING,
        allowNull: true
      });
    } catch (err) {
      console.log('subcityOther column may already exist:', err.message);
    }
    
    // Also ensure woreda and subcity exist
    try {
      await queryInterface.addColumn('students', 'woreda', {
        type: Sequelize.STRING,
        allowNull: true
      });
    } catch (err) {
      console.log('woreda column may already exist:', err.message);
    }
    
    try {
      await queryInterface.addColumn('students', 'subcity', {
        type: Sequelize.STRING,
        allowNull: true
      });
    } catch (err) {
      console.log('subcity column may already exist:', err.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('students', 'woredaOther').catch(() => {});
    await queryInterface.removeColumn('students', 'subcityOther').catch(() => {});
    await queryInterface.removeColumn('students', 'woreda').catch(() => {});
    await queryInterface.removeColumn('students', 'subcity').catch(() => {});
  }
};
