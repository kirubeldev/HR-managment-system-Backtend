/**
 * Migration: Add branch column to students, teaching_programs, leave_requests
 * And remove salary column from employees (if it exists)
 */
require('dotenv').config();
const sequelize = require('./src/config/database');

async function migrate() {
    const q = sequelize.getQueryInterface();

    console.log('Running branch migration...');

    try {
        // Add branch to students
        await q.addColumn('students', 'branch', {
            type: require('sequelize').DataTypes.ENUM('enkulal fabrica', 'bole center'),
            allowNull: true
        });
        console.log('✓ Added branch to students');
    } catch (e) { console.log('→ students.branch already exists or error:', e.message); }

    try {
        // Add branch to teaching_programs
        await q.addColumn('teaching_programs', 'branch', {
            type: require('sequelize').DataTypes.ENUM('enkulal fabrica', 'bole center'),
            allowNull: true
        });
        console.log('✓ Added branch to teaching_programs');
    } catch (e) { console.log('→ teaching_programs.branch already exists or error:', e.message); }

    try {
        // Add branch to leave_requests
        await q.addColumn('leave_requests', 'branch', {
            type: require('sequelize').DataTypes.ENUM('enkulal fabrica', 'bole center'),
            allowNull: true
        });
        console.log('✓ Added branch to leave_requests');
    } catch (e) { console.log('→ leave_requests.branch already exists or error:', e.message); }

    try {
        // Remove salary from employees if it exists
        await q.removeColumn('employees', 'salary');
        console.log('✓ Removed salary from employees');
    } catch (e) { console.log('→ employees.salary not found or already removed:', e.message); }

    console.log('\nMigration complete!');
    process.exit(0);
}

migrate().catch(e => { console.log('Migration failed:', e); process.exit(1); });
