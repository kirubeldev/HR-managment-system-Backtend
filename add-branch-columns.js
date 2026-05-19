require('dotenv').config();
const { sequelize } = require('./src/models');

async function run() {
  try {
    await sequelize.query(`
      ALTER TABLE departments
        ADD COLUMN IF NOT EXISTS branch VARCHAR(50)
          CHECK (branch IN ('enkulal fabrica', 'bole center'));
      ALTER TABLE projects
        ADD COLUMN IF NOT EXISTS branch VARCHAR(50)
          CHECK (branch IN ('enkulal fabrica', 'bole center'));
      ALTER TABLE positions
        ADD COLUMN IF NOT EXISTS branch VARCHAR(50)
          CHECK (branch IN ('enkulal fabrica', 'bole center'));
    `);
    console.log('SUCCESS: branch added to departments, projects, positions');
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}
run();
