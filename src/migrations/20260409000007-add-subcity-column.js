'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Try to add subcity column using raw SQL for reliability
    try {
      await queryInterface.sequelize.query(`
        ALTER TABLE students 
        ADD COLUMN IF NOT EXISTS "subcity" VARCHAR(255),
        ADD COLUMN IF NOT EXISTS "subcityOther" VARCHAR(255),
        ADD COLUMN IF NOT EXISTS "woreda" VARCHAR(255),
        ADD COLUMN IF NOT EXISTS "woredaOther" VARCHAR(255);
      `);
      console.log('Successfully added woreda/subcity columns');
    } catch (err) {
      console.error('Error adding columns:', err.message);
      // Try individual column additions as fallback
      const columns = [
        { name: 'subcity', type: 'VARCHAR(255)' },
        { name: 'subcityOther', type: 'VARCHAR(255)' },
        { name: 'woreda', type: 'VARCHAR(255)' },
        { name: 'woredaOther', type: 'VARCHAR(255)' }
      ];
      
      for (const col of columns) {
        try {
          await queryInterface.sequelize.query(
            `ALTER TABLE students ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type};`
          );
          console.log(`Added column: ${col.name}`);
        } catch (colErr) {
          console.log(`Column ${col.name} may already exist or error:`, colErr.message);
        }
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns
    const columns = ['subcity', 'subcityOther', 'woreda', 'woredaOther'];
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
