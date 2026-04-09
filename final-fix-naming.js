const { sequelize } = require('./src/models');

async function finalFix() {
  const migrations = [
    { old: 'activationtoken', new: 'activationToken' },
    { old: 'activationtokenexpiry', new: 'activationTokenExpiry' }
  ];

  for (const m of migrations) {
    try {
      // Use double quotes and exact case
      await sequelize.query(`ALTER TABLE users RENAME COLUMN "${m.old}" TO "${m.new}"`);
      console.log(`✅ Fixed: ${m.old} -> ${m.new}`);
    } catch (e) {
      console.log(`⚠️ Note for ${m.old}: ${e.message}`);
    }
  }
  process.exit(0);
}

finalFix();
