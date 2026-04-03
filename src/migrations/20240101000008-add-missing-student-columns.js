'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Check if students table exists
      const tables = await queryInterface.sequelize.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'students'",
        { type: Sequelize.QueryTypes.SELECT, transaction }
      );
      
      if (tables.length > 0) {
        console.log('Students table exists, checking for missing columns...');
        
        // Get existing columns
        const existingColumns = await queryInterface.sequelize.query(
          "SELECT column_name FROM information_schema.columns WHERE table_name = 'students'",
          { type: Sequelize.QueryTypes.SELECT, transaction }
        );
        
        const columnNames = existingColumns.map(col => col.column_name);
        
        // Add missing columns
        const columnsToAdd = [
          { name: 'profileImageUrl', type: Sequelize.STRING, allowNull: true },
          { name: 'age', type: Sequelize.INTEGER, allowNull: true },
          { name: 'gender', type: Sequelize.STRING, allowNull: true },
          { name: 'educationLevel', type: Sequelize.STRING, allowNull: true },
          { name: 'phoneNumber', type: Sequelize.STRING, allowNull: true },
          { name: 'email', type: Sequelize.STRING, allowNull: true },
          { name: 'nationality', type: Sequelize.STRING, allowNull: true },
          { name: 'region', type: Sequelize.STRING, allowNull: true },
          { name: 'subCity', type: Sequelize.STRING, allowNull: true },
          { name: 'woreda', type: Sequelize.STRING, allowNull: true },
          { name: 'kebele', type: Sequelize.STRING, allowNull: true },
          { name: 'houseNumber', type: Sequelize.STRING, allowNull: true },
          { name: 'registrationDate', type: Sequelize.DATE, allowNull: true },
          { name: 'teacherId', type: Sequelize.UUID, allowNull: true },
          { name: 'isActive', type: Sequelize.BOOLEAN, defaultValue: true }
        ];
        
        for (const col of columnsToAdd) {
          if (!columnNames.includes(col.name)) {
            console.log(`Adding column: ${col.name}`);
            await queryInterface.addColumn('students', col.name, {
              type: col.type,
              allowNull: col.allowNull,
              defaultValue: col.defaultValue
            }, { transaction });
          } else {
            console.log(`Column ${col.name} already exists`);
          }
        }
        
        // Add teacherId foreign key constraint if it doesn't exist
        try {
          await queryInterface.addConstraint('students', {
            fields: ['teacherId'],
            type: 'foreign key',
            name: 'students_teacherId_fkey',
            references: {
              model: 'employees',
              key: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
            transaction
          });
          console.log('Added teacherId foreign key constraint');
        } catch (e) {
          console.log('Foreign key constraint may already exist or failed:', e.message);
        }
      }
      
      await transaction.commit();
      console.log('Students table columns updated successfully!');
      
    } catch (error) {
      await transaction.rollback();
      console.error('Migration failed:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    console.log('Down migration not implemented');
  }
};
