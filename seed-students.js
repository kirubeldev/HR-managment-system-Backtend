const { Student } = require('./src/models');
const { generateDisplayId } = require('./src/utils/idGenerator');

async function seedStudents() {
  const branches = ['enkulal fabrica', 'bole center'];
  
  // 10 trainees, 10 children
  const studentsToCreate = [];
  
  for (let i = 1; i <= 10; i++) {
    studentsToCreate.push({
      type: 'trainee',
      fullName: `Trainee Student ${i}`,
      branch: branches[i % 2],
      gender: i % 2 === 0 ? 'Female' : 'Male',
      phoneNumber: `0911000${i.toString().padStart(2, '0')}`,
      age: 18 + i,
      educationLevel: i % 2 === 0 ? 'Degree' : 'Diploma',
      region: 'Addis Ababa',
      subcity: 'Bole',
      woreda: '03',
      kebele: '01',
      houseNumber: `${i}00`,
      nationality: 'Ethiopian'
    });
  }

  for (let i = 1; i <= 10; i++) {
    studentsToCreate.push({
      type: 'child',
      firstName: `Child`,
      lastName: `Name ${i}`,
      fullName: `Child Name ${i}`,
      branch: branches[i % 2],
      gender: i % 2 === 0 ? 'Female' : 'Male',
      age: 3 + (i % 4),
      region: 'Addis Ababa',
      subcity: 'Arada',
      woreda: '01',
      kebele: '05',
      houseNumber: `${i}12`,
      motherName: `Mother ${i}`,
      nationality: 'Ethiopian',
      dateOfBirth: new Date(2020 - (i % 4), 1, 1).toISOString().split('T')[0]
    });
  }

  console.log('🚀 Seeding students/trainees across branches...');
  
  for (const data of studentsToCreate) {
    try {
      const displayId = await generateDisplayId('STUDENT');
      await Student.create({ ...data, displayId });
      console.log(`✅ Created ${data.type.toUpperCase()}: ${data.fullName} [${displayId}] at ${data.branch}`);
    } catch (err) {
      console.error(`❌ Failed to create student: ${err.message}`);
    }
  }

  console.log('✨ Seeding complete.');
  process.exit();
}

seedStudents();
