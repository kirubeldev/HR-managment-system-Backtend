const { sequelize } = require('./src/models');

async function fixSeed() {
  try {
    console.log('Fixing seed data...');
    
    // Clear all tables in correct order to avoid foreign key constraints
    await sequelize.query('DELETE FROM role_permissions');
    await sequelize.query('DELETE FROM permissions');
    await sequelize.query('DELETE FROM users');
    await sequelize.query('DELETE FROM employees');
    await sequelize.query('DELETE FROM departments');
    await sequelize.query('DELETE FROM students');
    await sequelize.query('DELETE FROM leave_requests');
    await sequelize.query('DELETE FROM audit_logs');
    await sequelize.query('DELETE FROM refresh_tokens');
    await sequelize.query('DELETE FROM roles');
    
    console.log('All tables cleared');
    console.log('Database is ready for fresh seeding');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixSeed();
