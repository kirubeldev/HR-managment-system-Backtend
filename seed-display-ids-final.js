const { sequelize } = require('./src/models');

async function seedDisplayIdsFinal() {
  try {
    console.log('Seeding display IDs with correct column names...');
    
    // Get users without displayId and assign them
    const [usersWithoutId] = await sequelize.query(`
      SELECT id, email FROM users WHERE displayid IS NULL ORDER BY "createdAt"
    `);
    
    for (let i = 0; i < usersWithoutId.length; i++) {
      const displayId = `DEP${(i + 1).toString().padStart(3, '0')}`;
      await sequelize.query('UPDATE users SET displayid = :displayId WHERE id = :id', {
        replacements: { displayId, id: usersWithoutId[i].id }
      });
      console.log(`User ${usersWithoutId[i].email} -> ${displayId}`);
    }
    
    // Get employees without displayId and assign them
    const [employeesWithoutId] = await sequelize.query(`
      SELECT id, "firstName", "lastName" FROM employees WHERE displayid IS NULL ORDER BY "createdAt"
    `);
    
    for (let i = 0; i < employeesWithoutId.length; i++) {
      const displayId = `EMP${(i + 1).toString().padStart(3, '0')}`;
      await sequelize.query('UPDATE employees SET displayid = :displayId WHERE id = :id', {
        replacements: { displayId, id: employeesWithoutId[i].id }
      });
      console.log(`Employee ${employeesWithoutId[i].firstName} ${employeesWithoutId[i].lastName} -> ${displayId}`);
    }
    
    // Get students without displayId and assign them
    const [studentsWithoutId] = await sequelize.query(`
      SELECT id, "firstName", "lastName" FROM students WHERE displayid IS NULL ORDER BY "createdAt"
    `);
    
    for (let i = 0; i < studentsWithoutId.length; i++) {
      const displayId = `STU${(i + 1).toString().padStart(3, '0')}`;
      await sequelize.query('UPDATE students SET displayid = :displayId WHERE id = :id', {
        replacements: { displayId, id: studentsWithoutId[i].id }
      });
      console.log(`Student ${studentsWithoutId[i].firstName || 'N/A'} -> ${displayId}`);
    }
    
    // Get leave requests without displayId and assign them
    const [leavesWithoutId] = await sequelize.query(`
      SELECT id, "leaveType" FROM leave_requests WHERE displayid IS NULL ORDER BY "createdAt"
    `);
    
    for (let i = 0; i < leavesWithoutId.length; i++) {
      const displayId = `LEA${(i + 1).toString().padStart(3, '0')}`;
      await sequelize.query('UPDATE leave_requests SET displayid = :displayId WHERE id = :id', {
        replacements: { displayId, id: leavesWithoutId[i].id }
      });
      console.log(`Leave Request ${leavesWithoutId[i].leaveType} -> ${displayId}`);
    }
    
    console.log('\nDisplay IDs seeded successfully!');
    console.log(`Users updated: ${usersWithoutId.length}`);
    console.log(`Employees updated: ${employeesWithoutId.length}`);
    console.log(`Students updated: ${studentsWithoutId.length}`);
    console.log(`Leave requests updated: ${leavesWithoutId.length}`);
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
    process.exit(1);
  }
}

seedDisplayIdsFinal();
