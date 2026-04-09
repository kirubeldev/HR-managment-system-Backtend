const { sequelize } = require('./src/models');

async function workingEnumFix() {
  try {
    console.log('Working enum fix...');
    
    // First, let's see what we have
    const [before] = await sequelize.query('SELECT type, COUNT(*) as count FROM students GROUP BY type');
    console.log('Before fix:', before);
    
    // Update the data to change 'family' to 'child' temporarily using a text column
    await sequelize.query('ALTER TABLE students ALTER COLUMN type TYPE VARCHAR(20)');
    console.log('Changed column to VARCHAR');
    
    // Update the data (though there might not be any family records)
    await sequelize.query('UPDATE students SET type = \'child\' WHERE type = \'family\'');
    console.log('Updated family to child');
    
    // Drop and recreate the enum
    await sequelize.query('DROP TYPE IF EXISTS enum_students_type CASCADE');
    await sequelize.query('CREATE TYPE enum_students_type AS ENUM (\'trainee\', \'child\')');
    console.log('Recreated enum type');
    
    // Use a more direct approach - add new column, copy data, drop old, rename
    await sequelize.query('ALTER TABLE students ADD COLUMN type_new enum_students_type DEFAULT \'trainee\'');
    console.log('Added new column');
    
    // Copy data from old column to new column
    await sequelize.query('UPDATE students SET type_new = type::enum_students_type');
    console.log('Copied data to new column');
    
    // Drop old column
    await sequelize.query('ALTER TABLE students DROP COLUMN type');
    console.log('Dropped old column');
    
    // Rename new column
    await sequelize.query('ALTER TABLE students RENAME COLUMN type_new TO type');
    console.log('Renamed column');
    
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

workingEnumFix();
