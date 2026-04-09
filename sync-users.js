const { sequelize } = require('./src/models');

async function syncUsersTable() {
  try {
    console.log('--- Attempting to fix missing User columns ---');
    
    const missingColumns = [
      { name: 'name', type: 'VARCHAR(255)' },
      { name: 'otp', type: 'VARCHAR(255)' },
      { name: 'otpExpiry', type: 'TIMESTAMP WITH TIME ZONE' },
      { name: 'activationToken', type: 'VARCHAR(255)' },
      { name: 'activationTokenExpiry', type: 'TIMESTAMP WITH TIME ZONE' }
    ];

    for (const col of missingColumns) {
      try {
        await sequelize.query(`ALTER TABLE "users" ADD COLUMN "${col.name}" ${col.type};`);
        console.log(`✅ Added ${col.name} to users`);
      } catch (e) {
        console.log(`ℹ️ Column ${col.name} might already exist or error:`, e.message);
      }
    }

    console.log('--- User table sync attempt completed ---');
  } catch (err) {
    console.error('❌ Critical error during User sync:', err.message);
  } finally {
    process.exit();
  }
}

syncUsersTable();
