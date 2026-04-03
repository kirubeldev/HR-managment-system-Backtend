'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if profileImageUrl column exists
    const columns = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'profileImageUrl'",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (columns.length === 0) {
      console.log('Adding profileImageUrl column to students table...');
      await queryInterface.addColumn('students', 'profileImageUrl', {
        type: Sequelize.STRING,
        allowNull: true
      });
      console.log('profileImageUrl column added successfully!');
    } else {
      console.log('profileImageUrl column already exists');
    }
    
    // Also ensure age column exists
    const ageColumns = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'age'",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (ageColumns.length === 0) {
      console.log('Adding age column to students table...');
      await queryInterface.addColumn('students', 'age', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
    
    // Ensure gender column exists
    const genderColumns = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'gender'",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (genderColumns.length === 0) {
      console.log('Adding gender column to students table...');
      await queryInterface.addColumn('students', 'gender', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    
    // Ensure educationLevel column exists
    const eduColumns = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'educationLevel'",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (eduColumns.length === 0) {
      console.log('Adding educationLevel column to students table...');
      await queryInterface.addColumn('students', 'educationLevel', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    
    // Ensure teacherId column exists
    const teacherColumns = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'teacherId'",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (teacherColumns.length === 0) {
      console.log('Adding teacherId column to students table...');
      await queryInterface.addColumn('students', 'teacherId', {
        type: Sequelize.UUID,
        allowNull: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove columns if needed
    try {
      await queryInterface.removeColumn('students', 'profileImageUrl');
    } catch (e) {
      console.log('profileImageUrl column does not exist');
    }
  }
};
