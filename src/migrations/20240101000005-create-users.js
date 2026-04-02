'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      passwordHash: { type: Sequelize.STRING, allowNull: false },
      roleId: {
        type: Sequelize.UUID, allowNull: false,
        references: { model: 'roles', key: 'id' },
      },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: false },
      resetToken: { type: Sequelize.STRING, allowNull: true },
      resetTokenExpiry: { type: Sequelize.DATE, allowNull: true },
      isDeleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('users'); },
};
