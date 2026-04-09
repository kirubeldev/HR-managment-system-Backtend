const { sequelize } = require('./src/models');

async function seedDisplayIdsFixed() {
  try {
    console.log('Seeding display IDs with proper SQL...');
    
    // Update users without displayId
    const userResult = await sequelize.query(`
      UPDATE users 
      SET displayid = 'DEP' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::text, 3, '0')
      WHERE displayid IS NULL
      RETURNING email, displayid
    `);
    
    // Update employees without displayId
    const empResult = await sequelize.query(`
      UPDATE employees 
      SET displayid = 'EMP' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::text, 3, '0')
      WHERE displayid IS NULL
      RETURNING "firstName", "lastName", displayid
    `);
    
    // Update students without displayId
    const stuResult = await sequelize.query(`
      UPDATE students 
      SET displayid = 'STU' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::text, 3, '0')
      WHERE displayid IS NULL
      RETURNING "firstName", displayid
    `);
    
    // Update leave requests without displayId
    const leaveResult = await sequelize.query(`
      UPDATE leave_requests 
      SET displayid = 'LEA' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::text, 3, '0')
      WHERE displayid IS NULL
      RETURNING "leaveType", displayid
    `);
    
    console.log('Display IDs seeded successfully!');
    console.log('Users updated:', userResult[0].length);
    console.log('Employees updated:', empResult[0].length);
    console.log('Students updated:', stuResult[0].length);
    console.log('Leave requests updated:', leaveResult[0].length);
    
    // Show sample results
    console.log('\nSample results:');
    console.log('Users:', userResult[0].slice(0, 3));
    console.log('Employees:', empResult[0].slice(0, 3));
    console.log('Students:', stuResult[0].slice(0, 3));
    console.log('Leave requests:', leaveResult[0].slice(0, 3));
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
    process.exit(1);
  }
}

seedDisplayIdsFixed();
