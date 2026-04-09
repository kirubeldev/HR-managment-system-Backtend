'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, update existing data from 'family' to 'child'
    await queryInterface.sequelize.query(`
      UPDATE students 
      SET type = 'child' 
      WHERE type = 'family'
    `);

    // Then alter the enum to replace 'family' with 'child'
    await queryInterface.changeColumn('students', 'type', {
      type: Sequelize.ENUM('trainee', 'child'),
      allowNull: false,
      defaultValue: 'trainee'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverse: change 'child' back to 'family'
    await queryInterface.sequelize.query(`
      UPDATE students 
      SET type = 'family' 
      WHERE type = 'child'
    `);

    // Then alter the enum back
    await queryInterface.changeColumn('students', 'type', {
      type: Sequelize.ENUM('trainee', 'family'),
      allowNull: false,
      defaultValue: 'trainee'
    });
  }
};
