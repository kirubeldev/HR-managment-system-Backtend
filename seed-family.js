const { Student } = require('./src/models');
const sequelize = require('./src/config/database');

const seedFamilyData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        const familyMembers = [
            {
                type: 'family',
                firstName: 'Abebe',
                lastName: 'Bikila',
                gender: 'Male',
                age: 8,
                dateOfBirth: '2018-05-12',
                motherName: 'Tigist Assefa',
                maritalStatus: 'Single',
                monthlyIncome: '5000 ETB',
                phoneNumber: '0911223344',
                branch: 'enkulal fabrica',
                nationality: 'Ethiopian',
                region: 'Addis Ababa',
                subCity: 'Arada',
                woreda: '01'
            },
            {
                type: 'family',
                firstName: 'Sara',
                lastName: 'Girma',
                gender: 'Female',
                age: 5,
                dateOfBirth: '2021-02-28',
                motherName: 'Makeda Bekele',
                maritalStatus: 'Married',
                monthlyIncome: '12000 ETB',
                phoneNumber: '0922334455',
                branch: 'bole center',
                nationality: 'Ethiopian',
                region: 'Addis Ababa',
                subCity: 'Bole',
                woreda: '03'
            },
             {
                type: 'family',
                firstName: 'Kidus',
                lastName: 'Yohannes',
                gender: 'Male',
                age: 4,
                dateOfBirth: '2022-09-15',
                motherName: 'Tsehay Gemechu',
                maritalStatus: 'Divorced',
                monthlyIncome: '3500 ETB',
                phoneNumber: '0944556677',
                branch: 'enkulal fabrica',
                nationality: 'Ethiopian',
                region: 'Addis Ababa',
                subCity: 'Gullele',
                woreda: '05'
            }
        ];

        for (const member of familyMembers) {
            await Student.create(member);
        }

        console.log('Successfully seeded family students.');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed data:', error);
        process.exit(1);
    }
};

seedFamilyData();
