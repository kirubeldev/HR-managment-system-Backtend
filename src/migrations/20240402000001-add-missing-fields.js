'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add description to departments
        await queryInterface.addColumn('departments', 'description', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        // Add name to users
        await queryInterface.addColumn('users', 'name', {
            type: Sequelize.STRING,
            allowNull: true
        });

        // Add salary to employees
        await queryInterface.addColumn('employees', 'salary', {
            type: Sequelize.DECIMAL(15, 2),
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('departments', 'description');
        await queryInterface.removeColumn('users', 'name');
        await queryInterface.removeColumn('employees', 'salary');
    }
};
