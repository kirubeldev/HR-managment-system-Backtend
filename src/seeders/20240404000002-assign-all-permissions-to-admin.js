'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Get admin role ID
      const adminRole = await queryInterface.sequelize.query(
        "SELECT id FROM roles WHERE name = 'admin' LIMIT 1",
        { type: Sequelize.QueryTypes.SELECT, transaction }
      );

      if (!adminRole || adminRole.length === 0) {
        console.log('Admin role not found');
        await transaction.commit();
        return;
      }

      const adminRoleId = adminRole[0].id;

      // Get all permissions
      const permissions = await queryInterface.sequelize.query(
        'SELECT id FROM permissions',
        { type: Sequelize.QueryTypes.SELECT, transaction }
      );

      if (!permissions || permissions.length === 0) {
        console.log('No permissions found');
        await transaction.commit();
        return;
      }

      console.log(`Found ${permissions.length} permissions`);

      // Delete existing permissions for admin to avoid duplicates
      await queryInterface.bulkDelete('role_permissions', {
        roleId: adminRoleId
      }, { transaction });

      // Insert all permissions for admin role
      const rolePermissions = permissions.map(perm => ({
        roleId: adminRoleId,
        permissionId: perm.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      await queryInterface.bulkInsert('role_permissions', rolePermissions, { transaction });

      await transaction.commit();
      console.log(`✅ Assigned all ${permissions.length} permissions to admin role`);
      console.log('Admin now has FULL SYSTEM ACCESS');
      
    } catch (error) {
      await transaction.rollback();
      console.error('Error assigning permissions:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove all permissions from admin role
    const adminRole = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'admin' LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (adminRole && adminRole.length > 0) {
      await queryInterface.bulkDelete('role_permissions', {
        roleId: adminRole[0].id
      });
      console.log('Removed all permissions from admin role');
    }
  }
};
