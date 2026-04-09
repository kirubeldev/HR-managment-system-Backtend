const { sequelize } = require('./src/models');

async function migrate() {
    const queryInterface = sequelize.getQueryInterface();
    const table = 'students';

    console.log(`Starting migration for ${table} table...`);

    try {
        const columns = await queryInterface.describeTable(table);

        // 1. Handle Enum creation for PostgreSQL
        if (!columns['type']) {
            console.log('Adding "type" column...');
            try {
                // Check if enum exists
                const [enums] = await sequelize.query("SELECT n.nspname as schema, t.typname as type FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'enum_students_type'");
                
                if (enums.length === 0) {
                    await sequelize.query(`CREATE TYPE "enum_students_type" AS ENUM('trainee', 'family')`);
                }
                
                await queryInterface.addColumn(table, 'type', {
                    type: 'enum_students_type',
                    defaultValue: 'trainee',
                    allowNull: true
                });
            } catch (enumErr) {
                console.log('Enum addition failed, trying VARCHAR path...');
                await queryInterface.addColumn(table, 'type', {
                    type: 'VARCHAR(50)',
                    defaultValue: 'trainee',
                    allowNull: true
                });
            }
            await sequelize.query(`UPDATE students SET type = 'trainee' WHERE type IS NULL`);
        }

        const newColumns = {
            firstName: { type: 'VARCHAR(255)', allowNull: true },
            lastName: { type: 'VARCHAR(255)', allowNull: true },
            dateOfBirth: { type: 'DATE', allowNull: true }, // Changed from DATEONLY to DATE
            motherName: { type: 'VARCHAR(255)', allowNull: true },
            maritalStatus: { type: 'VARCHAR(100)', allowNull: true },
            numberOfChildren: { type: 'INTEGER', allowNull: true },
            employmentStatus: { type: 'VARCHAR(255)', allowNull: true },
            workDetails: { type: 'TEXT', allowNull: true },
            workWereda: { type: 'VARCHAR(255)', allowNull: true },
            childrenInCenter: { type: 'INTEGER', allowNull: true },
            monthlyIncome: { type: 'VARCHAR(100)', allowNull: true }
        };

        for (const [name, config] of Object.entries(newColumns)) {
            if (!columns[name]) {
                console.log(`Adding column: ${name}`);
                await queryInterface.addColumn(table, name, config);
            } else {
                console.log(`Column ${name} already exists.`);
            }
        }

        // 2. Make existing Trainee fields nullable
        const fieldsToMakeNullable = ['fullName', 'age', 'gender', 'educationLevel'];
        for (const field of fieldsToMakeNullable) {
            if (columns[field] && !columns[field].allowNull) {
                console.log(`Making ${field} nullable...`);
                await sequelize.query(`ALTER TABLE students ALTER COLUMN "${field}" DROP NOT NULL`);
            }
        }

        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    }
    process.exit(0);
}

migrate();
