const { Role, Permission } = require('../models');
const auditLogService = require('./auditLog.service');

const getAll = async () => Role.findAll({ where: { isDeleted: false }, include: [{ model: Permission, as: 'permissions' }] });

const create = async (name, actorId) => {
  const existing = await Role.findOne({ where: { name, isDeleted: false } });
  if (existing) throw Object.assign(new Error('Role already exists'), { status: 409 });
  const role = await Role.create({ name });
  await auditLogService.log(actorId, 'CREATE', 'role', role.id, { name });
  return role;
};

const update = async (id, name, actorId) => {
  const role = await Role.findOne({ where: { id, isDeleted: false } });
  if (!role) throw Object.assign(new Error('Role not found'), { status: 404 });
  await role.update({ name });
  await auditLogService.log(actorId, 'UPDATE', 'role', id, { name });
  return role;
};

const remove = async (id, actorId) => {
  const role = await Role.findOne({ where: { id, isDeleted: false } });
  if (!role) throw Object.assign(new Error('Role not found'), { status: 404 });
  await role.update({ isDeleted: true, deletedAt: new Date() });
  await auditLogService.log(actorId, 'DELETE', 'role', id);
};

module.exports = { getAll, create, update, remove };
