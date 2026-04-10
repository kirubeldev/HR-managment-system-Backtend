const { Department, Employee } = require('../models');
const auditLogService = require('./auditLog.service');

const { Op } = require('sequelize');

const getAll = async ({ page = 1, limit = 10, search = '' }) => {
  const where = { isDeleted: false };
  if (search) where.name = { [Op.iLike]: `%${search}%` };
  
  // If limit=0, return all records without pagination
  const shouldPaginate = limit !== '0' && limit !== 0;
  const queryOptions = {
    where,
    include: [{ model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName'] }],
    order: [['createdAt', 'DESC']],
  };
  
  if (shouldPaginate) {
    queryOptions.limit = Number(limit);
    queryOptions.offset = (page - 1) * limit;
  }
  
  const { count, rows } = await Department.findAndCountAll(queryOptions);
  return shouldPaginate 
    ? { total: count, page: Number(page), limit: Number(limit), data: rows }
    : { total: count, data: rows };
};

const create = async (data, actorId) => {
  const existing = await Department.findOne({ where: { name: data.name, isDeleted: false } });
  if (existing) throw Object.assign(new Error('Department already exists'), { status: 409 });
  const dept = await Department.create(data);
  await auditLogService.log(actorId, 'CREATE', 'department', dept.id, { name: data.name });
  return dept;
};

const update = async (id, data, actorId) => {
  const dept = await Department.findOne({ where: { id, isDeleted: false } });
  if (!dept) throw Object.assign(new Error('Department not found'), { status: 404 });
  await dept.update(data);
  await auditLogService.log(actorId, 'UPDATE', 'department', id, data);
  return dept;
};

const remove = async (id, actorId) => {
  const dept = await Department.findOne({ where: { id, isDeleted: false } });
  if (!dept) throw Object.assign(new Error('Department not found'), { status: 404 });
  await dept.update({ isDeleted: true, deletedAt: new Date() });
  await auditLogService.log(actorId, 'DELETE', 'department', id);
};

module.exports = { getAll, create, update, remove };
