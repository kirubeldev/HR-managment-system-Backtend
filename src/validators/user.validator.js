const Joi = require('joi');

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().allow(null, ''),
  roleId: Joi.string().uuid().required(),
  branch: Joi.string().valid('enkulal fabrica', 'bole center').allow(null, ''),
});

const updateUserSchema = Joi.object({
  name: Joi.string().allow(null, ''),
  roleId: Joi.string().uuid(),
  isActive: Joi.boolean(),
  branch: Joi.string().valid('enkulal fabrica', 'bole center').allow(null, ''),
}).min(1);

const profileUpdateSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(8),
}).min(1);

module.exports = { createUserSchema, updateUserSchema, profileUpdateSchema };
