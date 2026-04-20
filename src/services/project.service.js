const { Project, Employee } = require('../models');
const auditLogService = require('./auditLog.service');
const { Op } = require('sequelize');

const getAll = async ({ page = 1, limit = 10, search = '', year = '' }) => {
  const where = { isDeleted: false };
  if (search) where.name = { [Op.iLike]: `%${search}%` };
  if (year) {
    where.creationDate = {
      [Op.and]: [
        { [Op.gte]: `${year}-01-01` },
        { [Op.lte]: `${year}-12-31` }
      ]
    };
  }

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

  const { count, rows } = await Project.findAndCountAll(queryOptions);
  return shouldPaginate
    ? { total: count, page: Number(page), limit: Number(limit), data: rows }
    : { total: count, data: rows };
};

const create = async (data, actorId) => {
  const existing = await Project.findOne({ where: { name: data.name, isDeleted: false } });
  if (existing) throw Object.assign(new Error('Project already exists'), { status: 409 });
  const project = await Project.create(data);
  await auditLogService.log(actorId, 'CREATE', 'project', project.id, { name: data.name });
  return project;
};

const update = async (id, data, actorId) => {
  const project = await Project.findOne({ where: { id, isDeleted: false } });
  if (!project) throw Object.assign(new Error('Project not found'), { status: 404 });
  await project.update(data);
  await auditLogService.log(actorId, 'UPDATE', 'project', id, data);
  return project;
};

const remove = async (id, actorId) => {
  const project = await Project.findOne({ where: { id, isDeleted: false } });
  if (!project) throw Object.assign(new Error('Project not found'), { status: 404 });
  await project.update({ isDeleted: true, deletedAt: new Date() });
  await auditLogService.log(actorId, 'DELETE', 'project', id);
};

module.exports = { getAll, create, update, remove };
