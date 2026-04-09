'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const columnsToAdd = [
      { name: 'woreda', type: Sequelize.STRING, allowNull: true },
      { name: 'woredaOther', type: Sequelize.STRING, allowNull: true },
      { name: 'subcity', type: Sequelize.STRING, allowNull: true },
      { name: 'subcityOther', type: Sequelize.STRING, allowNull: true },
      { name: 'subCity', type: Sequelize.STRING, allowNull: true },
      { name: 'region', type: Sequelize.STRING, allowNull: true },
      { name: 'kebele', type: Sequelize.STRING, allowNull: true },
      { name: 'houseNumber', type: Sequelize.STRING, allowNull: true },
      { name: 'nationality', type: Sequelize.STRING, allowNull: true },
      { name: 'phoneNumber', type: Sequelize.STRING, allowNull: true },
      { name: 'motherName', type: Sequelize.STRING, allowNull: true },
      { name: 'maritalStatus', type: Sequelize.STRING, allowNull: true },
      { name: 'numberOfChildren', type: Sequelize.INTEGER, allowNull: true },
      { name: 'employmentStatus', type: Sequelize.STRING, allowNull: true },
      { name: 'workDetails', type: Sequelize.TEXT, allowNull: true },
      { name: 'workWereda', type: Sequelize.STRING, allowNull: true },
      { name: 'childrenInCenter', type: Sequelize.INTEGER, allowNull: true },
      { name: 'monthlyIncome', type: Sequelize.STRING, allowNull: true },
      { name: 'educationLevel', type: Sequelize.STRING, allowNull: true },
      { name: 'teacherId', type: Sequelize.UUID, allowNull: true },
      { name: 'branch', type: Sequelize.ENUM('enkulal fabrica', 'bole center'), allowNull: true },
      { name: 'profileImageUrl', type: Sequelize.STRING, allowNull: true },
      { name: 'documentUrl', type: Sequelize.STRING, allowNull: true },
    ];

    for (const col of columnsToAdd) {
      try {
        await queryInterface.addColumn('students', col.name, {
          type: col.type,
          allowNull: col.allowNull
        });
        console.log(`Added column: ${col.name}`);
      } catch (err) {
        console.log(`Column ${col.name} may already exist or error: ${err.message}`);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const columnsToRemove = [
      'woreda', 'woredaOther', 'subcity', 'subcityOther', 'subCity', 'region',
      'kebele', 'houseNumber', 'nationality', 'phoneNumber', 'motherName',
      'maritalStatus', 'numberOfChildren', 'employmentStatus', 'workDetails',
      'workWereda', 'childrenInCenter', 'monthlyIncome', 'educationLevel',
      'teacherId', 'branch', 'profileImageUrl', 'documentUrl'
    ];

    for (const colName of columnsToRemove) {
      try {
        await queryInterface.removeColumn('students', colName);
      } catch (err) {
        console.log(`Column ${colName} may not exist: ${err.message}`);
      }
    }
  }
};
