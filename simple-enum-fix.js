const { sequelize } = require('./src/models');

async function simpleEnumFix() {
  try {
    console.log('Simple enum fix...');
    
    // Drop the enum type
    await sequelize.query('DROP TYPE IF EXISTS enum_students_type CASCADE');
    console.log('Dropped enum type');
    
    // Create new enum type
    await sequelize.query('CREATE TYPE enum_students_type AS ENUM (\'trainee\', \'child\')');
    console.log('Created new enum type');
    
    // Add the type column back with the new enum
    await sequelize.query('ALTER TABLE students ADD COLUMN type enum_students_type DEFAULT \'trainee\'');
    console.log('Added type column with new enum');
    
    // Update any existing data that was 'family' to 'child'
    await sequelize.query('UPDATE students SET type = \'child\' WHERE type = \'family\'');
    console.log('Updated family to child');
    
    // Verify
    const [result] = await sequelize.query('SELECT type, COUNT(*) as count FROM students GROUP BY type');
    console.log('Current types:', result);
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    process.exit(1);
  }
}

simpleEnumFix();
