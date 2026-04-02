'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('refresh_tokens', {
            id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
            token: { type: Sequelize.STRING, allowNull: false, unique: true },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE',
            },
            expiresAt: { type: Sequelize.DATE, allowNull: false },
            createdAt: { type: Sequelize.DATE, allowNull: false },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('refresh_tokens');
    }
};
