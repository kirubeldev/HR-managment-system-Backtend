'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('students', {
            id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
            fullName: { type: Sequelize.STRING, allowNull: false },
            age: { type: Sequelize.INTEGER, allowNull: false },
            gender: { type: Sequelize.STRING, allowNull: false },
            educationLevel: { type: Sequelize.STRING, allowNull: false },
            region: { type: Sequelize.STRING },
            subCity: { type: Sequelize.STRING },
            woreda: { type: Sequelize.STRING },
            kebele: { type: Sequelize.STRING },
            houseNumber: { type: Sequelize.STRING },
            nationality: { type: Sequelize.STRING },
            registrationDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            phoneNumber: { type: Sequelize.STRING },
            teacherId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: { model: 'employees', key: 'id' },
                onDelete: 'SET NULL',
            },
            leatherProducts: { type: Sequelize.BOOLEAN, defaultValue: false },
            basicComputerSkills: { type: Sequelize.BOOLEAN, defaultValue: false },
            plumbingMaintenance: { type: Sequelize.BOOLEAN, defaultValue: false },
            digitalLiteracy: { type: Sequelize.BOOLEAN, defaultValue: false },
            graphicsDesign: { type: Sequelize.BOOLEAN, defaultValue: false },
            networking: { type: Sequelize.BOOLEAN, defaultValue: false },
            videoProduction: { type: Sequelize.BOOLEAN, defaultValue: false },
            programming: { type: Sequelize.BOOLEAN, defaultValue: false },
            metalWork: { type: Sequelize.BOOLEAN, defaultValue: false },
            makeup: { type: Sequelize.BOOLEAN, defaultValue: false },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('students');
    }
};
