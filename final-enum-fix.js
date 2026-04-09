const { sequelize } = require('./src/models');

async function finalEnumFix() {
  try {
    console.log('Final enum fix...');
    
    // First, let's see what we have
    const [before] = await sequelize.query('SELECT type, COUNT(*) as count FROM students GROUP BY type');
    console.log('Before fix:', before);
    
    // Update the data to change 'family' to 'child' temporarily using a text column
    await sequelize.query('ALTER TABLE students ALTER COLUMN type TYPE VARCHAR(20)');
    console.log('Changed column to VARCHAR');
    
    // Update the data
    await sequelize.query('UPDATE students SET type = \'child\' WHERE type = \'family\'');
    console.log('Updated family to child');
    
    // Drop and recreate the enum
    await sequelize.query('DROP TYPE IF EXISTS enum_students_type CASCADE');
    await sequelize.query('CREATE TYPE enum_students_type AS ENUM (\'trainee\', \'child\')');
    console.log('Recreated enum type');
    
    // Change column back to enum
    await sequelize.query('ALTER TABLE students ALTER COLUMN type TYPE enum_students_type');
    console.log('Changed column back to enum');
    
    // Verify
    const [after] = await sequelize.query('SELECT type, COUNT(*) as count FROM students GROUP BY type');
    console.log('After fix:', after);
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
    process.exit(1);
  }
}

finalEnumFix();
