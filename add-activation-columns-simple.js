const { sequelize } = require('./src/models');

async function addActivationColumns() {
  try {
    console.log('Adding activation columns to users table...');
    
    // Add columns without sequence dependencies
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS activationToken VARCHAR(255),
      ADD COLUMN IF NOT EXISTS activationTokenExpiry TIMESTAMP
    `);
    
    console.log('Activation columns added successfully');
    process.exit(0);
  } catch (err) {
    console.log('Error adding columns:', err.message);
    process.exit(1);
  }
}

addActivationColumns();
