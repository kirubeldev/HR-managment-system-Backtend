const Joi = require('joi');

const createDepartmentSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  managerId: Joi.string().uuid().allow(null, ''),
});

const updateDepartmentSchema = createDepartmentSchema.fork(['name'], (s) => s.optional());

module.exports = { createDepartmentSchema, updateDepartmentSchema };
