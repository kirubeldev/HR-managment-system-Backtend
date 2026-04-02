const { Student, LeaveRequest, sequelize } = require('./src/models');

(async () => {
    try {
        await sequelize.authenticate();
        const student = await Student.findOne();
        if (!student) {
            console.log('No students found. Please seed the database first.');
            process.exit(1);
        }

        const leave = await LeaveRequest.create({
            studentId: student.id,
            leaveType: 'Annual',
            reason: 'Vacation with family in the mountains.',
            startDate: new Date('2026-04-10'),
            endDate: new Date('2026-04-15'),
            totalDays: 6,
            handoverDetails: 'Dagi will handle my reports.',
            contactDetails: '+251 911 22 33 44',
            status: 'Pending'
        });

        console.log('Dummy leave request created:', leave.id);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
})();
