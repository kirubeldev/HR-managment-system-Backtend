const bcrypt = require('bcryptjs');
const { User, Role, Permission } = require('../models');
const authService = require('./auth.service');
const emailService = require('./email.service');
const auditLogService = require('./auditLog.service');
const { Op } = require('sequelize');

const getAll = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const where = { isDeleted: false };
  if (search) where.email = { [Op.iLike]: `%${search}%` };
  const { count, rows } = await User.findAndCountAll({
    where, limit: Number(limit), offset,
    include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }],
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['passwordHash', 'resetToken', 'resetTokenExpiry'] },
  });
  return { total: count, page: Number(page), limit: Number(limit), data: rows };
};

const getById = async (id) => {
  const user = await User.findOne({
    where: { id, isDeleted: false },
    include: [{ model: Role, as: 'role', include: [{ model: Permission, as: 'permissions' }] }],
    attributes: { exclude: ['passwordHash', 'resetToken', 'resetTokenExpiry'] },
  });
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  const permissions = user.role?.permissions?.map(p => p.name) || [];
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roleId: user.roleId,
    role: user.role?.name,
    permissions,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const create = async (data, actorId) => {
  const { email, roleId, name } = data;
  const existing = await User.findOne({ where: { email, isDeleted: false } });
  if (existing) throw Object.assign(new Error('Email already in use'), { status: 409 });

  const tempPasswordHash = await bcrypt.hash('Temp@' + Date.now(), 12);
  const resetToken = authService.generateResetToken();
  const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await User.create({ email, name, passwordHash: tempPasswordHash, roleId, resetToken, resetTokenExpiry, isActive: false });
  await emailService.sendResetLink(email, resetToken);
  await auditLogService.log(actorId, 'CREATE', 'user', user.id, { email });
  return { id: user.id, email: user.email, message: 'User created. Activation email sent.' };
};

const update = async (id, data, actorId) => {
  const user = await User.findOne({ where: { id, isDeleted: false } });
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  const updateData = { ...data };
  if (updateData.password) {
    updateData.passwordHash = await bcrypt.hash(updateData.password, 12);
    delete updateData.password;
  }

  await user.update(updateData);
  await auditLogService.log(actorId, 'UPDATE', 'user', id, updateData);
  return user;
};

const remove = async (id, actorId) => {
  const user = await User.findOne({ where: { id, isDeleted: false } });
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  await user.update({ isDeleted: true, deletedAt: new Date() });
  await auditLogService.log(actorId, 'DELETE', 'user', id);
};

module.exports = { getAll, getById, create, update, remove };
