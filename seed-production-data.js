/**
 * Seed script to populate data across both branches
 * 5 Employees per branch, 3 Programs per branch, and some students.
 */
require('dotenv').config();
const { Employee, TeachingProgram, Student, Department } = require('./src/models');
const { v4: uuidv4 } = require('uuid');

async function seed() {
    console.log('Seeding production-like data across branches...');

    try {
        // Get a department
        let dept = await Department.findOne();
        if (!dept) {
            dept = await Department.create({ name: 'General', description: 'General Department' });
        }

        const branches = ['enkulal fabrica', 'bole center'];
        
        for (const branch of branches) {
            console.log(`\n--- Seeding branch: ${branch} ---`);
            
            // Seed 5 Employees
            for (let i = 1; i <= 5; i++) {
                const email = `${branch.replace(' ', '.')}.emp${i}@example.com`;
                const emp = await Employee.create({
                    firstName: branch === 'enkulal fabrica' ? 'Enkulal' : 'Bole',
                    lastName: `Staff ${i}`,
                    email,
                    phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
                    position: i % 2 === 0 ? 'Teacher' : 'Administrator',
                    departmentId: dept.id,
                    hireDate: new Date(),
                    status: 'active',
                    branch: branch
                });
                console.log(`✓ Created employee: ${email}`);
            }

            // Seed 3 Teaching Programs
            for (let i = 1; i <= 3; i++) {
                const program = await TeachingProgram.create({
                    name: `${branch === 'enkulal fabrica' ? 'EF' : 'BC'} Program ${i} - ${uuidv4().slice(0, 4)}`,
                    description: `Standard curriculum for ${branch} branch.`,
                    branch: branch
                });
                console.log(`✓ Created program: ${program.name}`);
                
                // Seed 2 Students for each program
                for (let j = 1; j <= 2; j++) {
                    const student = await Student.create({
                        fullName: `${branch === 'enkulal fabrica' ? 'EF' : 'BC'} Student ${i}-${j}`,
                        age: 18 + Math.floor(Math.random() * 10),
                        gender: j % 2 === 0 ? 'Male' : 'Female',
                        educationLevel: 'Level ' + (i + j),
                        phoneNumber: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
                        branch: branch
                    });
                    // Associate student with program
                    await student.addProgram(program);
                    console.log(`  - Created student: ${student.fullName}`);
                }
            }
        }

        console.log('\nSeeding complete successfully!');
    } catch (e) {
        console.log('Seeding failed:', e);
    }
    process.exit(0);
}

seed();
