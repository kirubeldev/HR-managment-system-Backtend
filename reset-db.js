const { sequelize } = require('./src/models');

async function dropAllAndMigrate() {
  try {
    console.log('--- STARTING COMPLETE DATABASE DROP ---');
    
    // Drop tables in correct order or with CASCADE
    const tables = [
      'audit_logs', 'refresh_tokens', 'student_programs', 'role_permissions',
      'teaching_programs', 'leave_requests', 'students', 'employees',
      'users', 'departments', 'roles', 'permissions', 'SequelizeMeta', 'SequelizeData'
    ];

    for (const table of tables) {
      try {
        await sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
        console.log(`✅ Dropped ${table}`);
      } catch (e) {
        console.log(`ℹ️ Could not drop ${table}:`, e.message);
      }
    }
    
    console.log('✅ All tables dropped. Now ready for fresh migration.');
  } catch (err) {
    console.error('❌ Drop failed:', err.message);
  } finally {
    process.exit();
  }
}

dropAllAndMigrate();
