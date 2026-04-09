const { sequelize } = require('./src/models');

async function addNameColumn() {
  try {
    console.log('Adding name column to users table...');
    
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS name VARCHAR(255)
    `);
    
    console.log('Name column added successfully');
    process.exit(0);
  } catch (err) {
    console.log('Error:', err);
    process.exit(1);
  }
}

addNameColumn();
