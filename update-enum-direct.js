const { sequelize } = require('./src/models');

async function updateEnumDirectly() {
  try {
    console.log('Updating enum directly...');
    
    // First update the data
    await sequelize.query('UPDATE students SET type = \'child\' WHERE type = \'family\'');
    console.log('Updated data from family to child');
    
    // Drop the old enum constraint
    await sequelize.query('ALTER TABLE students DROP CONSTRAINT IF EXISTS students_type_check');
    console.log('Dropped old constraint');
    
    // Add new constraint
    await sequelize.query('ALTER TABLE students ADD CONSTRAINT students_type_check CHECK (type IN (\'trainee\', \'child\'))');
    console.log('Added new constraint');
    
    // Verify
    const [result] = await sequelize.query('SELECT type, COUNT(*) as count FROM students GROUP BY type');
    console.log('Current types:', result);
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    process.exit(1);
  }
}

updateEnumDirectly();
