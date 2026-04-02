const { Permission, Role } = require('../models');
const auditLogService = require('./auditLog.service');

const getAll = async () => Permission.findAll({ order: [['name', 'ASC']] });

const assignToRole = async (roleId, permissionIds, actorId) => {
  const role = await Role.findOne({ where: { id: roleId, isDeleted: false } });
  if (!role) throw Object.assign(new Error('Role not found'), { status: 404 });
  await role.setPermissions(permissionIds);
  await auditLogService.log(actorId, 'UPDATE', 'role_permissions', roleId, { permissionIds });
  return role.getPermissions();
};

module.exports = { getAll, assignToRole };
