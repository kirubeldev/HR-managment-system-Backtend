const { sequelize } = require('./src/models');

async function fixEnumAndColumn() {
  try {
    console.log('Fixing enum and column...');
    
    // Recreate the type column
    await sequelize.query('ALTER TABLE students ADD COLUMN type VARCHAR(20) DEFAULT \'trainee\'');
    console.log('Added type column back');
    
    // Create new enum type
    await sequelize.query('CREATE TYPE enum_students_type AS ENUM (\'trainee\', \'child\')');
    console.log('Created new enum type');
    
    // Update the column to use the new enum
    await sequelize.query('ALTER TABLE students ALTER COLUMN type TYPE enum_students_type');
    console.log('Updated column type');
    
    // Update the data - first check what we have
    const [beforeUpdate] = await sequelize.query('SELECT type, COUNT(*) as count FROM students GROUP BY type');
    console.log('Before update:', beforeUpdate);
    
    // Update any remaining 'family' values to 'child'
    await sequelize.query('UPDATE students SET type = \'child\' WHERE type = \'family\'');
    console.log('Updated data from family to child');
    
    // Verify
    const [result] = await sequelize.query('SELECT type, COUNT(*) as count FROM students GROUP BY type');
    console.log('Current types:', result);
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
    process.exit(1);
  }
}

fixEnumAndColumn();
