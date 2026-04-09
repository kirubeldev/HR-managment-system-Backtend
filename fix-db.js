const { sequelize } = require('./src/models');
const { Sequelize } = require('sequelize');

async function fixDatabase() {
  try {
    console.log('--- Attempting to fix branch columns manually ---');
    
    // Check if branch column exists in employees
    try {
      await sequelize.query('ALTER TABLE "employees" ADD COLUMN "branch" VARCHAR(255);');
      console.log('✅ Added branch to employees');
    } catch (e) {
      console.log('ℹ️ Branch column might already exist in employees or table not found:', e.message);
    }

    // Check if branch column exists in users
    try {
      await sequelize.query('ALTER TABLE "users" ADD COLUMN "branch" VARCHAR(255);');
      console.log('✅ Added branch to users');
    } catch (e) {
      console.log('ℹ️ Branch column might already exist in users or table not found:', e.message);
    }

    console.log('--- Database fix attempt completed ---');
  } catch (err) {
    console.error('❌ Critical error during DB fix:', err.message);
  } finally {
    process.exit();
  }
}

fixDatabase();
