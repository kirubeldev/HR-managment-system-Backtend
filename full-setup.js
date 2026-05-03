const { execSync } = require('child_process');
const { User, Role, sequelize } = require('./src/models');
const bcrypt = require('bcryptjs');

async function runSetup() {
  try {
    console.log('🚀 Starting Full Database Setup...');

    // 1. Run Migrations
    console.log('\n1️⃣ Creating Tables (Migrations)...');
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });

    // 2. Seed All Base Data (Roles, Permissions, etc.)
    console.log('\n2️⃣ Seeding Permissions, Roles, and Departments...');
    execSync('node seed-all-tables.js', { stdio: 'inherit' });

    // 3. Ensure Admin User exists and is linked to the ADMINISTRATOR role
    console.log('\n3️⃣ Finalizing Admin User...');
    const adminRole = await Role.findOne({ where: { name: 'ADMINISTRATOR' } });
    if (!adminRole) {
        console.error('❌ Error: ADMINISTRATOR role not found after seeding.');
        process.exit(1);
    }
    
    const passwordHash = await bcrypt.hash('Admin@1234', 12);
    await User.findOrCreate({
      where: { email: 'admin@hrms.com' },
      defaults: {
        name: 'System Administrator',
        passwordHash: passwordHash,
        roleId: adminRole.id,
        isActive: true,
      }
    });

    console.log('\n✅ Setup Successful! You can now run "npm run dev" to start the server.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Setup Failed:', error.message);
    process.exit(1);
  }
}

runSetup();
