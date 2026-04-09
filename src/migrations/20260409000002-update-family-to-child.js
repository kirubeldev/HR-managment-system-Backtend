'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, update existing data from 'family' to 'child'
    try {
      await queryInterface.sequelize.query(`
        UPDATE students 
        SET type = 'child' 
        WHERE type = 'family'
      `);
    } catch (err) {
      console.log('Update family to child failed (maybe family is not a valid enum value):', err.message);
    }

    // Then alter the enum to replace 'family' with 'child'
    try {
      await queryInterface.changeColumn('students', 'type', {
        type: Sequelize.ENUM('trainee', 'child'),
        allowNull: false,
        defaultValue: 'trainee'
      });
    } catch (err) {
      console.log('ChangeColumn type failed (maybe already child):', err.message);
    }
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
