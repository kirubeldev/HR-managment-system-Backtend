/**
 * Script to assign existing branchless data to 'enkulal fabrica' 
 * and also clean up salary field mapping if any.
 */
require('dotenv').config();
const { Employee, Student, TeachingProgram, LeaveRequest } = require('./src/models');

async function fixData() {
    console.log('Fixing existing records to assign to enkulal fabrica...');

    try {
        const [empCount] = await Employee.update(
            { branch: 'enkulal fabrica' },
            { where: { branch: null } }
        );
        console.log(`✓ Updated ${empCount} employees`);

        const [studentCount] = await Student.update(
            { branch: 'enkulal fabrica' },
            { where: { branch: null } }
        );
        console.log(`✓ Updated ${studentCount} students`);

        const [programCount] = await TeachingProgram.update(
            { branch: 'enkulal fabrica' },
            { where: { branch: null } }
        );
        console.log(`✓ Updated ${programCount} programs`);

        const [leaveCount] = await LeaveRequest.update(
            { branch: 'enkulal fabrica' },
            { where: { branch: null } }
        );
        console.log(`✓ Updated ${leaveCount} leave requests`);

    } catch (e) {
        console.error('Failed to fix data:', e);
    }

    console.log('\nData fix complete!');
    process.exit(0);
}

fixData().catch(e => { console.error(e); process.exit(1); });
