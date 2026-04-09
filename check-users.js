const { User } = require('./src/models');

async function check() {
    try {
        const users = await User.findAll({ attributes: ['email', 'passwordHash', 'roleId'] });
        console.log('Users in database:');
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.log('Check failed:', err);
        process.exit(1);
    }
}

check();
