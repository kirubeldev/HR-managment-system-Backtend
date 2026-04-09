const { sequelize } = require('./src/models');

async function verifySeededIds() {
  try {
    console.log('Verifying seeded display IDs...');
    
    // Use correct column names from the schema output
    const [users] = await sequelize.query('SELECT email, displayid FROM users LIMIT 5');
    const [employees] = await sequelize.query('SELECT firstName, lastName, displayid FROM employees LIMIT 5');
    const [students] = await sequelize.query('SELECT firstName, displayid FROM students LIMIT 5');
    const [leaves] = await sequelize.query('SELECT leaveType, displayid FROM leave_requests LIMIT 5');
    
    console.log('Sample Users:', users);
    console.log('Sample Employees:', employees);
    console.log('Sample Students:', students);
    console.log('Sample Leave Requests:', leaves);
    
    // Check counts
    const [userCount] = await sequelize.query('SELECT COUNT(*) as count FROM users WHERE displayid IS NOT NULL');
    const [empCount] = await sequelize.query('SELECT COUNT(*) as count FROM employees WHERE displayid IS NOT NULL');
    const [stuCount] = await sequelize.query('SELECT COUNT(*) as count FROM students WHERE displayid IS NOT NULL');
    const [leaveCount] = await sequelize.query('SELECT COUNT(*) as count FROM leave_requests WHERE displayid IS NOT NULL');
    
    console.log('\nCounts:');
    console.log('Users with displayId:', userCount[0].count);
    console.log('Employees with displayId:', empCount[0].count);
    console.log('Students with displayId:', stuCount[0].count);
    console.log('Leave requests with displayId:', leaveCount[0].count);
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
    process.exit(1);
  }
}

verifySeededIds();
