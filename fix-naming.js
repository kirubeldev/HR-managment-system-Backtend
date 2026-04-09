const { sequelize } = require('./src/models');

async function fixNaming() {
  const migrations = [
    { old: 'activationtoken', new: 'activationToken' },
    { old: 'activationtokenexpiry', new: 'activationTokenExpiry' },
    { old: 'otpexpiry', new: 'otpExpiry' },
    { old: 'resettoken', new: 'resetToken' },
    { old: 'resettokenexpiry', new: 'resetTokenExpiry' }
  ];

  for (const m of migrations) {
    try {
      // Try to rename if lowercase exists
      await sequelize.query(`ALTER TABLE users RENAME COLUMN "${m.old}" TO "${m.new}"`);
      console.log(`✅ Renamed ${m.old} to ${m.new}`);
    } catch (e) {
      console.log(`ℹ️ Column ${m.old} not found or already renamed.`);
    }
  }
  process.exit(0);
}

fixNaming();
