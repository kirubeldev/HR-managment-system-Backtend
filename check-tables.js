const { sequelize } = require('./src/models');

async function checkTableStructure() {
  try {
    console.log('Checking table structure...');
    
    const [usersSchema] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position");
    const [empSchema] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'employees' ORDER BY ordinal_position");
    const [stuSchema] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'students' ORDER BY ordinal_position");
    const [leaveSchema] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'leave_requests' ORDER BY ordinal_position");
    
    console.log('Users table columns:', usersSchema.map(c => c.column_name));
    console.log('Employees table columns:', empSchema.map(c => c.column_name));
    console.log('Students table columns:', stuSchema.map(c => c.column_name));
    console.log('Leave requests table columns:', leaveSchema.map(c => c.column_name));
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    process.exit(1);
  }
}

checkTableStructure();
