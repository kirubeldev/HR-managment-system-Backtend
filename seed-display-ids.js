const { User, Employee, Student, LeaveRequest } = require('./src/models');
const { generateDisplayId } = require('./src/utils/idGenerator');

async function seedExistingRecords() {
  try {
    console.log('Seeding existing records with display IDs...');
    
    // Seed Users
    const users = await User.findAll({ where: { displayId: null, isDeleted: false } });
    console.log(`Found ${users.length} users without displayId`);
    
    for (const user of users) {
      const displayId = await generateDisplayId('USER');
      await user.update({ displayId });
      console.log(`User ${user.email} -> ${displayId}`);
    }
    
    // Seed Employees
    const employees = await Employee.findAll({ where: { displayId: null, isDeleted: false } });
    console.log(`Found ${employees.length} employees without displayId`);
    
    for (const employee of employees) {
      const displayId = await generateDisplayId('EMPLOYEE');
      await employee.update({ displayId });
      console.log(`Employee ${employee.firstName} ${employee.lastName} -> ${displayId}`);
    }
    
    // Seed Students
    const students = await Student.findAll({ where: { displayId: null, isDeleted: false } });
    console.log(`Found ${students.length} students without displayId`);
    
    for (const student of students) {
      const displayId = await generateDisplayId('STUDENT');
      await student.update({ displayId });
      console.log(`Student ${student.firstName || student.fullName} -> ${displayId}`);
    }
    
    // Seed Leave Requests
    const leaves = await LeaveRequest.findAll({ where: { displayId: null } });
    console.log(`Found ${leaves.length} leave requests without displayId`);
    
    for (const leave of leaves) {
      const displayId = await generateDisplayId('LEAVE');
      await leave.update({ displayId });
      console.log(`Leave Request -> ${displayId}`);
    }
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
    process.exit(1);
  }
}

seedExistingRecords();
