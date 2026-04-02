'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('teaching_programs', {
            id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
            name: { type: Sequelize.STRING, allowNull: false, unique: true },
            description: { type: Sequelize.TEXT, allowNull: true },
            isDeleted: { type: Sequelize.BOOLEAN, defaultValue: false },
            deletedAt: { type: Sequelize.DATE, allowNull: true },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });

        await queryInterface.createTable('student_programs', {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            studentId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'students', key: 'id' },
                onDelete: 'CASCADE'
            },
            programId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'teaching_programs', key: 'id' },
                onDelete: 'CASCADE'
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('student_programs');
        await queryInterface.dropTable('teaching_programs');
    }
};
