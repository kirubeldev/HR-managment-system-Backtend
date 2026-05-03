const Joi = require('joi');

const createDepartmentSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  managerId: Joi.string().uuid().allow(null, ''),
  creationDate: Joi.string().isoDate().allow(null, ''),
  endDate: Joi.date().max('now').allow(null, ''),
  branch: Joi.string().valid('enkulal fabrica', 'bole center').allow(null, ''),
  status: Joi.string().valid('active', 'inactive').allow(null, ''),
});

const updateDepartmentSchema = createDepartmentSchema.fork(['name'], (s) => s.optional());

module.exports = { createDepartmentSchema, updateDepartmentSchema };
