'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add lowercase columns that are missing
    const columnsToAdd = [
      { name: 'subcity', type: 'VARCHAR(255)' },
      { name: 'subcityOther', type: 'VARCHAR(255)' },
      { name: 'woredaOther', type: 'VARCHAR(255)' }
    ];
    
    for (const col of columnsToAdd) {
      try {
        await queryInterface.sequelize.query(
          `ALTER TABLE students ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type};`
        );
        console.log(`✅ Added column: ${col.name}`);
      } catch (err) {
        console.log(`Column ${col.name} may already exist:`, err.message);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const columns = ['subcity', 'subcityOther', 'woredaOther'];
    for (const col of columns) {
      try {
        await queryInterface.sequelize.query(
          `ALTER TABLE students DROP COLUMN IF EXISTS "${col}";`
        );
      } catch (err) {
        console.log(`Column ${col} may not exist:`, err.message);
      }
    }
  }
};
