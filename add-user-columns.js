const { sequelize } = require('./src/models');

async function addColumns() {
  const columns = {
    name: 'VARCHAR(255)',
    branch: 'VARCHAR(255)',
    otp: 'VARCHAR(10)',
    otpExpiry: 'TIMESTAMP',
    activationToken: 'VARCHAR(100)',
    activationTokenExpiry: 'TIMESTAMP'
  };

  for (const [col, type] of Object.entries(columns)) {
    try {
      await sequelize.query(`ALTER TABLE users ADD COLUMN "${col}" ${type}`);
      console.log(`✅ Added column: ${col}`);
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log(`ℹ️ Column ${col} already exists.`);
      } else {
        console.log(`❌ Error adding column ${col}:`, e.message);
      }
    }
  }
  process.exit(0);
}

addColumns();
