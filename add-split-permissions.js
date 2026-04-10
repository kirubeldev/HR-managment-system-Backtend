const { Permission, sequelize } = require('./src/models');
const { v4: uuidv4 } = require('uuid');

async function splitPermissions() {
    const adminRoleId = '11111111-1111-1111-1111-000000000001';
    
    // Legacy permissions to remove
    const legacyPermissions = [
        'view_student', 'create_student', 'edit_student', 'delete_student'
    ];

    const newPermissions = [
        'view_child', 'view_trainee',
        'create_child', 'create_trainee',
        'edit_child', 'edit_trainee',
        'delete_child', 'delete_trainee'
    ];

    const transaction = await sequelize.transaction();
    try {
        console.log('Cleaning up legacy permissions and adding split permissions...');

        // 1. Delete legacy permissions (and their role associations)
        for (const name of legacyPermissions) {
            const perm = await Permission.findOne({ where: { name }, transaction });
            if (perm) {
                // Remove role associations first
                await sequelize.query(
                    'DELETE FROM role_permissions WHERE "permissionId" = :permId',
                    { replacements: { permId: perm.id }, transaction }
                );
                // Delete permission
                await perm.destroy({ transaction });
                console.log(`Deleted legacy permission: ${name}`);
            }
        }
        
        // 2. Add and assign new permissions
        for (const name of newPermissions) {
            // Find or create permission
            const [permission, created] = await Permission.findOrCreate({
                where: { name },
                defaults: { id: uuidv4() },
                transaction
            });

            if (created) {
                console.log(`Created permission: ${name}`);
            }

            // Assign to Administrator role
            const [exists] = await sequelize.query(
                'SELECT * FROM role_permissions WHERE "roleId" = :roleId AND "permissionId" = :permissionId',
                {
                    replacements: { roleId: adminRoleId, permissionId: permission.id },
                    type: sequelize.QueryTypes.SELECT,
                    transaction
                }
            );

            if (!exists) {
                await sequelize.query(
                    'INSERT INTO role_permissions ("roleId", "permissionId", "createdAt", "updatedAt") VALUES (:roleId, :permissionId, NOW(), NOW())',
                    {
                        replacements: { roleId: adminRoleId, permissionId: permission.id },
                        type: sequelize.QueryTypes.INSERT,
                        transaction
                    }
                );
                console.log(`Assigned ${name} to Administrator`);
            }
        }

        await transaction.commit();
        console.log('✅ Permissions cleanup and split completed.');
        process.exit(0);
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('❌ Error splitting permissions:', error.message);
        process.exit(1);
    }
}

splitPermissions();
