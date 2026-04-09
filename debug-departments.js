const { Department } = require('./src/models');

async function debugDepartments() {
  try {
    const depts = await Department.findAll({ where: { isDeleted: false } });
    console.log('--- DEPARTMENTS IN DB (isDeleted: false) ---');
    console.log(JSON.stringify(depts, null, 2));
    console.log('Total:', depts.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debugDepartments();
