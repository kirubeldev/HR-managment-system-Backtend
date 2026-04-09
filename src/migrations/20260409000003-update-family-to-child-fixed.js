'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, update existing data from 'family' to 'child'
    await queryInterface.sequelize.query(`
      UPDATE students 
      SET type = 'child' 
      WHERE type = 'family'
    `);

    // Drop the old enum constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE students DROP CONSTRAINT IF EXISTS students_type_check
    `);

    // Add the new enum constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE students ADD CONSTRAINT students_type_check 
      CHECK (type IN ('trainee', 'child'))
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Reverse: change 'child' back to 'family'
    await queryInterface.sequelize.query(`
      UPDATE students 
      SET type = 'family' 
      WHERE type = 'child'
    `);

    // Drop the new enum constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE students DROP CONSTRAINT IF EXISTS students_type_check
    `);

    // Add the old enum constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE students ADD CONSTRAINT students_type_check 
      CHECK (type IN ('trainee', 'family'))
    `);
  }
};
