const Joi = require('joi');

const createEmployeeSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  position: Joi.string().required(),
  departmentId: Joi.string().uuid().allow(null, ''),
  hireDate: Joi.string().isoDate().required(),
  salary: Joi.number().allow(null),
  profileImageUrl: Joi.string().uri().allow(null, ''),
  cvUrl: Joi.string().uri().allow(null, ''),
  idDocumentUrl: Joi.string().uri().allow(null, ''),
  dateOfBirth: Joi.string().isoDate().allow(null, ''),
  gender: Joi.string().allow(null, ''),
  country: Joi.string().allow(null, ''),
  city: Joi.string().allow(null, ''),
  address: Joi.string().allow(null, ''),
  emergencyContactName: Joi.string().allow(null, ''),
  emergencyContactPhone: Joi.string().allow(null, ''),
});

const updateEmployeeSchema = createEmployeeSchema.fork(
  ['firstName', 'lastName', 'email', 'phone', 'position', 'hireDate'],
  (s) => s.optional()
);

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive', 'terminated', 'leave').required(),
});

module.exports = { createEmployeeSchema, updateEmployeeSchema, updateStatusSchema };
