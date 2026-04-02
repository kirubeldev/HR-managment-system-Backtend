const { AuditLog, User } = require('../models');

const log = async (userId, action, entity, entityId, details = null) => {
  return AuditLog.create({ userId, action, entity, entityId, details });
};

const getAll = async ({ page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await AuditLog.findAndCountAll({
    limit: Number(limit), offset,
    include: [{ model: User, as: 'user', attributes: ['id', 'email'] }],
    order: [['createdAt', 'DESC']],
  });
  return { total: count, page: Number(page), limit: Number(limit), data: rows };
};

module.exports = { log, getAll };
