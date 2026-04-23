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

const getPositionsWithPermissions = async () => {
  const { Position } = require('../models');
  return Position.findAll({
    where: { isDeleted: false },
    include: [{ model: Permission, as: 'permissions' }],
    order: [['title', 'ASC']],
  });
};

const assignToPosition = async (positionId, permissionIds, actorId) => {
  const { Position } = require('../models');
  const position = await Position.findOne({ where: { id: positionId, isDeleted: false } });
  if (!position) throw Object.assign(new Error('Position not found'), { status: 404 });
  await position.setPermissions(permissionIds);
  await auditLogService.log(actorId, 'UPDATE', 'position_permissions', positionId, { permissionIds });
  return position.getPermissions();
};

module.exports = { getAll, assignToRole, getPositionsWithPermissions, assignToPosition };
