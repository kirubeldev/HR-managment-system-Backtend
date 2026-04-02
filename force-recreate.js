const { sequelize } = require('./src/models');

async function forceRecreate() {
    try {
        console.log('Dropping employees table with CASCADE...');
        await sequelize.query('DROP TABLE IF EXISTS "employees" CASCADE');
        console.log('Dropped employees table.');

        console.log('Syncing database...');
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully');
        process.exit(0);
    } catch (err) {
        console.error('Force recreate failed:', err);
        process.exit(1);
    }
}

// Set a timeout of 30 seconds
setTimeout(() => {
    console.error('Force recreate timed out');
    process.exit(1);
}, 30000);

forceRecreate();
