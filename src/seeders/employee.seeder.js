'use strict';

module.exports = {
    async up(queryInterface) {
        const now = new Date();
        const employees = [
            {
                id: '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a11',
                firstName: 'John', lastName: 'Doe', email: 'john.doe@tech.com', phone: '1234567890',
                position: 'Senior Developer', departmentId: null,
                hireDate: '2023-01-15', status: 'active',
                isDeleted: false, createdAt: now, updatedAt: now
            },
            {
                id: '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a12',
                firstName: 'Sarah', lastName: 'Wilson', email: 'sarah.w@finance.com', phone: '2233445566',
                position: 'Accountant', departmentId: null,
                hireDate: '2023-03-10', status: 'active',
                isDeleted: false, createdAt: now, updatedAt: now
            },
            {
                id: '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a13',
                firstName: 'Michael', lastName: 'Brown', email: 'm.brown@tech.com', phone: '3344556677',
                position: 'DevOps Engineer', departmentId: null,
                hireDate: '2022-11-20', status: 'active',
                isDeleted: false, createdAt: now, updatedAt: now
            },
            {
                id: '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a14',
                firstName: 'Emily', lastName: 'Davis', email: 'emily.d@hr.com', phone: '4455667788',
                position: 'HR Manager', departmentId: null,
                hireDate: '2021-06-15', status: 'active',
                isDeleted: false, createdAt: now, updatedAt: now
            },
            {
                id: '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a15',
                firstName: 'David', lastName: 'Miller', email: 'd.miller@tech.com', phone: '5566778899',
                position: 'QA Lead', departmentId: null,
                hireDate: '2024-01-05', status: 'active',
                isDeleted: false, createdAt: now, updatedAt: now
            }
        ];

        await queryInterface.bulkInsert('employees', employees);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('employees', null, {});
    }
};
