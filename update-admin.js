const bcrypt = require('bcryptjs');
const { User } = require('./src/models');
require('dotenv').config();

async function updateAdmin() {
    const email = process.env.ADMIN_EMAIL || 'kirubel1@jabezremedy.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
    const passwordHash = await bcrypt.hash(password, 12);

    try {
        // Update the admin user (assuming ID from seeder)
        const [updated] = await User.update(
            { email, passwordHash, isActive: true },
            { where: { id: '33333333-3333-3333-3333-000000000001' } }
        );

        if (updated) {
            console.log(`✅ Admin user updated to: ${email}`);
        } else {
            console.log('❌ Admin user not found with standard ID. Creating new one...');
            await User.create({
                id: '33333333-3333-3333-3333-000000000001',
                email,
                passwordHash,
                roleId: '11111111-1111-1111-1111-000000000001', // Super Admin Role ID
                isActive: true
            });
            console.log(`✅ Admin user created with: ${email}`);
        }
    } catch (err) {
        console.log('❌ Error updating admin:', err.message);
    } finally {
        process.exit();
    }
}

updateAdmin();
