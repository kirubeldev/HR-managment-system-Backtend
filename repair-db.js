const { sequelize } = require('./src/models');

async function repair() {
    try {
        console.log('Starting DB sync with alter: true...');
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully with alter: true');
        process.exit(0);
    } catch (err) {
        console.error('Repair failed:', err);
        process.exit(1);
    }
}

// Set a timeout of 30 seconds
setTimeout(() => {
    console.error('Repair timed out');
    process.exit(1);
}, 30000);

repair();
