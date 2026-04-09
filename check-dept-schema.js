const { sequelize } = require('./src/models');

async function checkSchema() {
  try {
    const [res] = await sequelize.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'departments'");
    console.log('Columns in departments table:', res.map(c => c.column_name));
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

checkSchema();
