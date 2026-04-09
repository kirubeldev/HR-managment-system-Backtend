const { sequelize } = require('./src/models');

async function updateFamilyToChild() {
  try {
    console.log('Updating family type to child in database...');
    
    // Update students table to change 'family' to 'child'
    const [result] = await sequelize.query(`
      UPDATE students 
      SET type = 'child' 
      WHERE type = 'family'
    `);
    
    console.log(`Updated ${result[1]} records from 'family' to 'child'`);
    
    // Verify the update
    const [types] = await sequelize.query('SELECT type, COUNT(*) as count FROM students GROUP BY type');
    console.log('Current student types:', types);
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    process.exit(1);
  }
}

updateFamilyToChild();
