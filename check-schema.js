const { sequelize } = require('./src/models');

async function check() {
  try {
    const [rs] = await sequelize.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
    console.log('EXACT_COLUMNS:', JSON.stringify(rs.map(r => r.column_name)));
  } catch (e) {
    console.log('ERROR:', e.message);
  }
  process.exit(0);
}

check();
