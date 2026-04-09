const { sequelize } = require('./src/models');

async function nuke() {
    try {
        console.log('Nuking database (dropping all tables with CASCADE)...');
        const tables = ['employees', 'departments', 'students', 'leave_requests', 'users', 'roles', 'permissions', 'role_permissions', 'audit_logs', 'refresh_tokens', 'SequelizeMeta'];
        for (const table of tables) {
            await sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
        }
        console.log('Database nuked.');
        process.exit(0);
    } catch (err) {
        console.log('Nuke failed:', err);
        process.exit(1);
    }
}

// Set a timeout of 30 seconds
setTimeout(() => {
    console.log('Nuke timed out');
    process.exit(1);
}, 30000);

nuke();
