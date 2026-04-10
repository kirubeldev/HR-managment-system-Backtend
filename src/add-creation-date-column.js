const sequelize = require('./config/database');

(async () => {
  try {
    console.log('Adding creationDate column to departments table...');
    
    // Try to add column directly
    await sequelize.query(`
      ALTER TABLE departments 
      ADD COLUMN "creationDate" DATE;
    `);
    
    console.log('✅ creationDate column added successfully!');
    process.exit(0);
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('✅ creationDate column already exists!');
      process.exit(0);
    }
    console.error('❌ Error adding column:', err.message);
    process.exit(1);
  }
})();
