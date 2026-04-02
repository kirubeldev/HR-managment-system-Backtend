const { sequelize } = require('./src/models');

async function checkTable(tableName) {
    try {
        const [results] = await sequelize.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${tableName}'`);
        console.log(`Columns in ${tableName} table:`);
        console.log(JSON.stringify(results, null, 2));
    } catch (err) {
        console.error(`Check for ${tableName} failed:`, err);
    }
}

async function check() {
    await checkTable('employees');
    await checkTable('departments');
    await checkTable('users');
    await checkTable('student_programs');
    process.exit(0);
}

check();
