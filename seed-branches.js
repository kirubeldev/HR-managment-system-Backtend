const { User, Employee, Role } = require('./src/models');
const sequelize = require('./src/config/database');

async function seed() {
  const branches = ['enkulal fabrica', 'bole center'];
  
  // Update Employees
  const employees = await Employee.findAll();
  for (const emp of employees) {
    if (!emp.branch) {
      emp.branch = branches[Math.floor(Math.random() * branches.length)];
      await emp.save();
    }
  }
  console.log(`Assigned branches to ${employees.length} employees.`);

  // Update Users
  const users = await User.findAll({ include: [{ model: Role, as: 'role' }] });
  for (const user of users) {
    if (!user.branch && user.role?.name !== 'Super Admin') {
      user.branch = branches[Math.floor(Math.random() * branches.length)];
      await user.save();
    }
  }
  console.log(`Assigned branches to ${users.length} users.`);

  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
