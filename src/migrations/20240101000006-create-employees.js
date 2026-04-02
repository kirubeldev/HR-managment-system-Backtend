'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      firstName: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      phone: { type: Sequelize.STRING, allowNull: false },
      position: { type: Sequelize.STRING, allowNull: false },
      departmentId: {
        type: Sequelize.UUID, allowNull: true,
        references: { model: 'departments', key: 'id' },
      },
      hireDate: { type: Sequelize.DATEONLY, allowNull: false },
      status: { type: Sequelize.ENUM('active', 'inactive', 'terminated'), defaultValue: 'active' },
      profileImageUrl: { type: Sequelize.STRING, allowNull: true },
      cvUrl: { type: Sequelize.STRING, allowNull: true },
      idDocumentUrl: { type: Sequelize.STRING, allowNull: true },
      dateOfBirth: { type: Sequelize.DATEONLY, allowNull: true },
      gender: { type: Sequelize.STRING, allowNull: true },
      country: { type: Sequelize.STRING, allowNull: true },
      city: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      emergencyContactName: { type: Sequelize.STRING, allowNull: true },
      emergencyContactPhone: { type: Sequelize.STRING, allowNull: true },
      isDeleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('employees');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_employees_status";');
  },
};
