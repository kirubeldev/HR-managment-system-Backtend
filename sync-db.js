const { sequelize } = require('./src/models');

async function sync() {
    try {
        // alter: true will attempt to add missing columns without dropping data
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully');
        process.exit(0);
    } catch (err) {
        console.log('Database sync failed:', err);
        process.exit(1);
    }
}

sync();
