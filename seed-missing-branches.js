const { Department, Position, Project, TeachingProgram } = require('./src/models');
const sequelize = require('./src/config/database');

async function seed() {
  const branches = ['enkulal fabrica', 'bole center'];
  
  // Update Departments
  const depts = await Department.findAll();
  for (const dept of depts) {
    if (!dept.branch) {
      dept.branch = branches[Math.floor(Math.random() * branches.length)];
      await dept.save();
    }
  }
  console.log(`Assigned branches to ${depts.length} departments.`);

  // Update Positions
  const positions = await Position.findAll();
  for (const pos of positions) {
    if (!pos.branch) {
      pos.branch = branches[Math.floor(Math.random() * branches.length)];
      await pos.save();
    }
  }
  console.log(`Assigned branches to ${positions.length} positions.`);

  // Update Projects
  const projects = await Project.findAll();
  for (const proj of projects) {
    if (!proj.branch) {
      proj.branch = branches[Math.floor(Math.random() * branches.length)];
      await proj.save();
    }
  }
  console.log(`Assigned branches to ${projects.length} projects.`);

  // Update Teaching Programs
  const programs = await TeachingProgram.findAll();
  for (const prog of programs) {
    if (!prog.branch) {
      prog.branch = branches[Math.floor(Math.random() * branches.length)];
      await prog.save();
    }
  }
  console.log(`Assigned branches to ${programs.length} teaching programs.`);

  process.exit(0);
}

seed().catch(err => {
  console.log(err);
  process.exit(1);
});
