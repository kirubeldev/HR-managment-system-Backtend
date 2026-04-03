'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Check if leave_requests table exists
      const tables = await queryInterface.sequelize.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leave_requests'",
        { type: Sequelize.QueryTypes.SELECT, transaction }
      );
      
      if (tables.length === 0) {
        console.log('Creating leave_requests table with employeeId...');
        
        // Create the leave_requests table with employeeId
        await queryInterface.createTable('leave_requests', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
          },
          employeeId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'employees',
              key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },
          leaveType: {
            type: Sequelize.ENUM('Annual', 'Sick', 'Maternity', 'Paternity', 'Emergency', 'Other'),
            allowNull: false
          },
          reason: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          startDate: {
            type: Sequelize.DATE,
            allowNull: false
          },
          endDate: {
            type: Sequelize.DATE,
            allowNull: false
          },
          totalDays: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          handoverDetails: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          contactDetails: {
            type: Sequelize.STRING,
            allowNull: true
          },
          status: {
            type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
            defaultValue: 'Pending'
          },
          supervisorName: {
            type: Sequelize.STRING,
            allowNull: true
          },
          supervisorComment: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
          }
        }, { transaction });
        
        console.log('Leave requests table created successfully with employeeId!');
      } else {
        console.log('Leave requests table exists, checking structure...');
        
        // Check if studentId column exists
        const columns = await queryInterface.sequelize.query(
          "SELECT column_name FROM information_schema.columns WHERE table_name = 'leave_requests' AND column_name = 'studentId'",
          { type: Sequelize.QueryTypes.SELECT, transaction }
        );
        
        if (columns.length > 0) {
          console.log('Converting studentId to employeeId...');
          
          // Delete existing data to avoid foreign key conflicts
          await queryInterface.bulkDelete('leave_requests', {}, { transaction });
          
          // Remove foreign key constraint
          try {
            await queryInterface.removeConstraint('leave_requests', 'leave_requests_studentId_fkey', { transaction });
          } catch (e) {
            console.log('No studentId constraint to remove');
          }
          
          // Rename column
          await queryInterface.renameColumn('leave_requests', 'studentId', 'employeeId', { transaction });
          
          // Add new foreign key constraint
          await queryInterface.addConstraint('leave_requests', {
            fields: ['employeeId'],
            type: 'foreign key',
            name: 'leave_requests_employeeId_fkey',
            references: {
              model: 'employees',
              key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            transaction
          });
          
          console.log('Column renamed and foreign key updated!');
        } else {
          console.log('studentId column does not exist, checking for employeeId...');
          
          const empColumns = await queryInterface.sequelize.query(
            "SELECT column_name FROM information_schema.columns WHERE table_name = 'leave_requests' AND column_name = 'employeeId'",
            { type: Sequelize.QueryTypes.SELECT, transaction }
          );
          
          if (empColumns.length === 0) {
            // Add employeeId column
            await queryInterface.addColumn('leave_requests', 'employeeId', {
              type: Sequelize.UUID,
              allowNull: true
            }, { transaction });
            
            // Add foreign key
            await queryInterface.addConstraint('leave_requests', {
              fields: ['employeeId'],
              type: 'foreign key',
              name: 'leave_requests_employeeId_fkey',
              references: {
                model: 'employees',
                key: 'id'
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
              transaction
            });
            
            console.log('employeeId column added!');
          }
        }
      }
      
      await transaction.commit();
      console.log('Migration completed successfully!');
      
    } catch (error) {
      await transaction.rollback();
      console.error('Migration failed:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // This is a complex migration, down would require reversing all changes
    console.log('Down migration not implemented for safety');
  }
};
