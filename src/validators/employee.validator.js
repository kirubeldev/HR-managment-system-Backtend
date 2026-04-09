const Joi = require('joi');

const createEmployeeSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  position: Joi.string().required(),
  departmentId: Joi.string().uuid().allow(null, ''),
  hireDate: Joi.string().isoDate().required(),
  profileImageUrl: Joi.string().uri().allow(null, ''),
  cvUrl: Joi.string().uri().allow(null, ''),
  idDocumentUrl: Joi.string().uri().allow(null, ''),
  dateOfBirth: Joi.string().isoDate().allow(null, ''),
  gender: Joi.string().allow(null, ''),
  country: Joi.string().allow(null, ''),
  city: Joi.string().allow(null, ''),
  woreda: Joi.string().valid('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12').allow(null, ''),
  woredaOther: Joi.string().allow(null, ''),
  subcity: Joi.string().allow(null, ''),
  subcityOther: Joi.string().allow(null, ''),
  address: Joi.string().allow(null, ''),
  emergencyContactName: Joi.string().allow(null, ''),
  emergencyContactPhone: Joi.string().allow(null, ''),
  branch: Joi.string().valid('enkulal fabrica', 'bole center').allow(null, ''),
}).custom((value, helpers) => {
  // Custom validation for hire date
  const hireDate = new Date(value.hireDate);
  const today = new Date();
  
  if (hireDate > today) {
    return helpers.error('custom.hireDateFuture');
  }
  
  // Custom validation for birth date if provided
  if (value.dateOfBirth) {
    const birthDate = new Date(value.dateOfBirth);
    const birthDatePlus15 = new Date(birthDate.getFullYear() + 15, birthDate.getMonth(), birthDate.getDate());
    
    // Check if birth date is before hire date
    if (birthDate >= hireDate) {
      return helpers.error('custom.birthDateAfterHire');
    }
    
    // Check if age is at least 15 years
    if (birthDatePlus15 > today) {
      const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      return helpers.error('custom.ageTooYoung', { age });
    }
  }
  
  return value;
}).messages({
  'custom.hireDateFuture': 'Hire date cannot be in the future',
  'custom.birthDateAfterHire': 'Birth date must be before hire date',
  'custom.ageTooYoung': 'Employee must be at least 15 years old. Current age: {{#age}} years',
});

const updateEmployeeSchema = createEmployeeSchema.fork(
  ['firstName', 'lastName', 'email', 'phone', 'position', 'hireDate'],
  (s) => s.optional()
);

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive', 'terminated', 'leave').required(),
});

module.exports = { createEmployeeSchema, updateEmployeeSchema, updateStatusSchema };
