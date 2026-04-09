const { Employee, Department } = require('../models');
const auditLogService = require('./auditLog.service');
const { generateDisplayId } = require('../utils/idGenerator');
const { Op } = require('sequelize');

const getAll = async ({ page = 1, limit = 10, search = '', status = '', departmentId = '', branch = '', gender = '' }) => {
  const offset = (page - 1) * limit;
  const where = { isDeleted: false };
  if (search) where[Op.or] = [
    { firstName: { [Op.iLike]: `%${search}%` } },
    { lastName: { [Op.iLike]: `%${search}%` } },
    { email: { [Op.iLike]: `%${search}%` } },
    { displayId: { [Op.iLike]: `%${search}%` } },
  ];
  if (status) where.status = status;
  if (departmentId) where.departmentId = departmentId;
  if (branch) where.branch = branch;
  if (gender) where.gender = gender;
  const { count, rows } = await Employee.findAndCountAll({
    where, limit: Number(limit), offset,
    include: [{ model: Department, as: 'department', attributes: ['id', 'name'] }],
    order: [['createdAt', 'DESC']],
  });
  return { total: count, page: Number(page), limit: Number(limit), data: rows };
};

const getById = async (id) => {
  const emp = await Employee.findOne({ where: { id, isDeleted: false }, include: [{ model: Department, as: 'department' }] });
  if (!emp) throw Object.assign(new Error('Employee not found'), { status: 404 });
  return emp;
};

const create = async (data, actorId) => {
  const existing = await Employee.findOne({ where: { email: data.email, isDeleted: false } });
  if (existing) throw Object.assign(new Error('Email already in use'), { status: 409 });
  
  // Generate unique display ID
  const displayId = await generateDisplayId('EMPLOYEE');
  
  const emp = await Employee.create({ ...data, displayId });
  await auditLogService.log(actorId, 'CREATE', 'employee', emp.id, { email: data.email, displayId });
  return emp;
};

const update = async (id, data, actorId) => {
  const emp = await Employee.findOne({ where: { id, isDeleted: false } });
  if (!emp) throw Object.assign(new Error('Employee not found'), { status: 404 });
  await emp.update(data);
  await auditLogService.log(actorId, 'UPDATE', 'employee', id, data);
  return emp;
};

const updateStatus = async (id, status, actorId) => {
  const emp = await Employee.findOne({ where: { id, isDeleted: false } });
  if (!emp) throw Object.assign(new Error('Employee not found'), { status: 404 });
  await emp.update({ status });
  await auditLogService.log(actorId, 'STATUS_CHANGE', 'employee', id, { status });
  return emp;
};

const remove = async (id, actorId) => {
  const emp = await Employee.findOne({ where: { id, isDeleted: false } });
  if (!emp) throw Object.assign(new Error('Employee not found'), { status: 404 });
  await emp.update({ isDeleted: true, deletedAt: new Date() });
  await auditLogService.log(actorId, 'DELETE', 'employee', id);
};

module.exports = { getAll, getById, create, update, updateStatus, remove };
