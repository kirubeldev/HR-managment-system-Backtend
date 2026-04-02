const { sequelize } = require('./src/models');

async function check() {
    try {
        const [results] = await sequelize.query("SELECT * FROM \"SequelizeMeta\"");
        console.log('Migrations in SequelizeMeta:');
        console.log(JSON.stringify(results, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err);
        process.exit(1);
    }
}

check();
