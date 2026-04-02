'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('leave_requests', {
            id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
            studentId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'students', key: 'id' },
                onDelete: 'CASCADE',
            },
            leaveType: {
                type: Sequelize.ENUM('Annual', 'Sick', 'Maternity', 'Paternity', 'Emergency', 'Other'),
                allowNull: false,
            },
            reason: { type: Sequelize.TEXT },
            startDate: { type: Sequelize.DATE, allowNull: false },
            endDate: { type: Sequelize.DATE, allowNull: false },
            totalDays: { type: Sequelize.INTEGER, allowNull: false },
            handoverDetails: { type: Sequelize.TEXT },
            contactDetails: { type: Sequelize.STRING },
            status: {
                type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
                defaultValue: 'Pending',
            },
            supervisorName: { type: Sequelize.STRING },
            supervisorComment: { type: Sequelize.TEXT },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('leave_requests');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_leave_requests_leaveType";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_leave_requests_status";');
    }
};
