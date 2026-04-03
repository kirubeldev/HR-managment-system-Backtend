'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if otp column exists
    const otpColumns = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'otp'",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (otpColumns.length === 0) {
      console.log('Adding OTP columns to users table...');
      
      // Add OTP column
      await queryInterface.addColumn('users', 'otp', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      
      // Add OTP expiry column
      await queryInterface.addColumn('users', 'otpExpiry', {
        type: Sequelize.DATE,
        allowNull: true,
      });
      
      console.log('OTP columns added successfully!');
    } else {
      console.log('OTP columns already exist');
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove OTP columns
    try {
      await queryInterface.removeColumn('users', 'otp');
    } catch (e) {
      console.log('otp column does not exist');
    }
    
    try {
      await queryInterface.removeColumn('users', 'otpExpiry');
    } catch (e) {
      console.log('otpExpiry column does not exist');
    }
  }
};
