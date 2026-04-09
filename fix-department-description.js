const { sequelize } = require('./src/models');

async function fixDepartmentSchema() {
  try {
    console.log('Adding column "description" to "departments" table...');
    await sequelize.query('ALTER TABLE "departments" ADD COLUMN IF NOT EXISTS "description" TEXT;');
    console.log('✅ Success!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

fixDepartmentSchema();
