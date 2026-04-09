'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('employees', 'woreda', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('employees', 'woredaOther', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('employees', 'subcity', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('employees', 'subcityOther', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('employees', 'woreda');
    await queryInterface.removeColumn('employees', 'woredaOther');
    await queryInterface.removeColumn('employees', 'subcity');
    await queryInterface.removeColumn('employees', 'subcityOther');
  }
};
