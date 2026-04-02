'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_permissions', {
      roleId: {
        type: Sequelize.UUID, allowNull: false,
        references: { model: 'roles', key: 'id' }, onDelete: 'CASCADE',
      },
      permissionId: {
        type: Sequelize.UUID, allowNull: false,
        references: { model: 'permissions', key: 'id' }, onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('role_permissions', {
      fields: ['roleId', 'permissionId'], type: 'primary key', name: 'role_permissions_pkey',
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('role_permissions'); },
};
