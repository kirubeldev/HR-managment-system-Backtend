const { Position } = require('../models');
const auditLogService = require('./auditLog.service');
const { Op } = require('sequelize');

const getAll = async ({ page = 1, limit = 10, search = '' }) => {
  const where = { isDeleted: false };
  if (search) where.title = { [Op.iLike]: `%${search}%` };

  const shouldPaginate = limit !== '0' && limit !== 0;
  const queryOptions = {
    where,
    order: [['title', 'ASC']],
  };

  if (shouldPaginate) {
    queryOptions.limit = Number(limit);
    queryOptions.offset = (page - 1) * limit;
  }

  const { count, rows } = await Position.findAndCountAll(queryOptions);
  return shouldPaginate
    ? { total: count, page: Number(page), limit: Number(limit), data: rows }
    : { total: count, data: rows };
};

const create = async (data, actorId) => {
  const existing = await Position.findOne({ where: { title: data.title, isDeleted: false } });
  if (existing) throw Object.assign(new Error('Position already exists'), { status: 409 });
  const position = await Position.create(data);
  await auditLogService.log(actorId, 'CREATE', 'position', position.id, { title: data.title });
  return position;
};

const update = async (id, data, actorId) => {
  const position = await Position.findOne({ where: { id, isDeleted: false } });
  if (!position) throw Object.assign(new Error('Position not found'), { status: 404 });
  await position.update(data);
  await auditLogService.log(actorId, 'UPDATE', 'position', id, data);
  return position;
};

const remove = async (id, actorId) => {
  const position = await Position.findOne({ where: { id, isDeleted: false } });
  if (!position) throw Object.assign(new Error('Position not found'), { status: 404 });
  await position.update({ isDeleted: true, deletedAt: new Date() });
  await auditLogService.log(actorId, 'DELETE', 'position', id);
};

module.exports = { getAll, create, update, remove };
