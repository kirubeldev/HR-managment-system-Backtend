const { sequelize } = require('./src/models');

async function addActivationColumns() {
  try {
    console.log('Adding activation columns to users table...');
    
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS activationToken VARCHAR(255),
      ADD COLUMN IF NOT EXISTS activationTokenExpiry TIMESTAMP
    `);
    
    console.log('Activation columns added successfully');
    process.exit(0);
  } catch (err) {
    console.log('Error:', err);
    process.exit(1);
  }
}

addActivationColumns();
