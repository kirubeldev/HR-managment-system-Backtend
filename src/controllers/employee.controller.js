const employeeService = require('../services/employee.service');
const { createEmployeeSchema, updateEmployeeSchema, updateStatusSchema } = require('../validators/employee.validator');
const mockData = require('../services/mockData.service');

const getAll = async (req, res, next) => {
  try {
    // MOCK MODE: Return 10 sample employees if mock user
    if (req.user && req.user.id === 'mock-admin-id') {
      const mockEmps = mockData.generateMockEmployees(10);
      return res.json({ 
        success: true, 
        data: mockEmps, 
        total: mockEmps.length,
        page: 1,
        pages: 1
      });
    }

    const filters = { ...req.query };
    // If not super admin, force branch filter to user's branch
    if (req.user && req.user.role && req.user.role.name !== 'Super Admin' && req.user.branch) {
      filters.branch = req.user.branch;
    }
    res.json({ success: true, ...(await employeeService.getAll(filters)) });
  } catch (err) { next(err); }
};
const getById = async (req, res, next) => {
  try { res.json({ success: true, data: await employeeService.getById(req.params.id) }); } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try {
    const { error } = createEmployeeSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const emp = await employeeService.create(req.body, req.user.id);
    res.status(201).json({ success: true, data: emp });
  } catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    const { error } = updateEmployeeSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const emp = await employeeService.update(req.params.id, req.body, req.user.id);
    res.json({ success: true, data: emp });
  } catch (err) { next(err); }
};
const updateStatus = async (req, res, next) => {
  try {
    const { error } = updateStatusSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const emp = await employeeService.updateStatus(req.params.id, req.body.status, req.user.id);
    res.json({ success: true, data: emp });
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    await employeeService.remove(req.params.id, req.user.id);
    res.json({ success: true, message: 'Employee deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, updateStatus, remove };
