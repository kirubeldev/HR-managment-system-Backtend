const { Student, TeachingProgram, Employee, LeaveRequest, sequelize } = require('../models');

const teachers = [
    { firstName: 'Abebe', lastName: 'Bikila', email: 'abebe@example.com', phone: '0911223344', position: 'Senior Instructor', hireDate: '2020-01-01', status: 'active' },
    { firstName: 'Marta', lastName: 'Tesfaye', email: 'marta@example.com', phone: '0922334455', position: 'Language Teacher', hireDate: '2021-05-15', status: 'active' },
    { firstName: 'Solomon', lastName: 'Kebede', email: 'solomon@example.com', phone: '0933445566', position: 'Coding Mentor', hireDate: '2022-03-10', status: 'active' },
];

const programs = [
    { name: 'Fullstack Web Development', description: 'Master React, Node.js and SQL.' },
    { name: 'Mobile App Graphics', description: 'Focus on UI/UX and Flutter.' },
    { name: 'Data Science Basics', description: 'Introduction to Python and Pandas.' },
    { name: 'Digital Marketing', description: 'SEO, SEM and Social Media strategy.' },
];

const students = [
    { fullName: 'Kirubel Daniel', age: 22, gender: 'Male', educationLevel: 'Degree', phoneNumber: '0944556677', profileImageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop' },
    { fullName: 'Selam Hailu', age: 20, gender: 'Female', educationLevel: 'Diploma', phoneNumber: '0955667788', profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
    { fullName: 'Dawit Mekonnen', age: 24, gender: 'Male', educationLevel: 'Certificate', phoneNumber: '0966778899', profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
    { fullName: 'Eden Tadesse', age: 21, gender: 'Female', educationLevel: 'Degree', phoneNumber: '0977889900', profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop' },
    { fullName: 'Samuel Gebre', age: 23, gender: 'Male', educationLevel: 'Diploma', phoneNumber: '0988990011', profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
];

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB for seeding...');

        // Create Teachers
        // Use findOrCreate to avoid duplicates on retry
        const createdTeachers = [];
        for (const t of teachers) {
            const [emp] = await Employee.findOrCreate({ where: { email: t.email }, defaults: t });
            createdTeachers.push(emp);
        }
        console.log('✅ Teachers seeded/verified');

        // Create Programs
        const createdPrograms = [];
        for (const p of programs) {
            const [prog] = await TeachingProgram.findOrCreate({ where: { name: p.name }, defaults: p });
            createdPrograms.push(prog);
        }
        console.log('✅ Programs seeded/verified');

        // Create Students
        for (let i = 0; i < students.length; i++) {
            const studentData = students[i];
            const teacher = createdTeachers[i % createdTeachers.length];
            
            const [student] = await Student.findOrCreate({ 
                where: { fullName: studentData.fullName }, 
                defaults: {
                    ...studentData,
                    teacherId: teacher.id,
                    registrationDate: new Date()
                }
            });

            // Assign random programs
            const randomPrograms = createdPrograms.sort(() => 0.5 - Math.random()).slice(0, 2);
            await student.setPrograms(randomPrograms);

            // Create 2 Leave Requests for each student if they don't have any
            const leaveCount = await LeaveRequest.count({ where: { studentId: student.id } });
            if (leaveCount === 0) {
                await LeaveRequest.create({
                    studentId: student.id,
                    leaveType: 'Sick Leave',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 86400000 * 2), // 2 days later
                    reason: 'Feeling unwell, need rest.',
                    status: 'Pending',
                    totalDays: 2
                });

                await LeaveRequest.create({
                    studentId: student.id,
                    leaveType: 'Personal',
                    startDate: new Date(Date.now() - 86400000 * 10),
                    endDate: new Date(Date.now() - 86400000 * 7),
                    reason: 'Family emergency.',
                    status: 'Approved',
                    totalDays: 3
                });
            }
        }

        console.log('✅ Students & Leave Requests seeded');
        console.log('🎉 Seeding completed successfully!');
    } catch (err) {
        console.log('❌ Seeding failed:', err);
    } finally {
        process.exit();
    }
}

seed();
