const Student = require('./models/Student');
const sequelize = require('./config/database');

async function fixData() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB...');

        const students = await Student.findAll();
        console.log(`Found ${students.length} students. Checking for missing types or branches...`);

        let updatedCount = 0;
        for (const student of students) {
            let needsUpdate = false;
            const updateData = {};

            if (!student.type) {
                updateData.type = Math.random() > 0.4 ? 'trainee' : 'child';
                needsUpdate = true;
            }

            if (!student.branch) {
                updateData.branch = Math.random() > 0.5 ? 'enkulal fabrica' : 'bole center';
                needsUpdate = true;
            }

            if (needsUpdate) {
                await student.update(updateData);
                updatedCount++;
            }
        }

        console.log(`✅ Fixed ${updatedCount} students.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error fixing data:', err);
        process.exit(1);
    }
}

fixData();
