const deptService = require('../services/department.service');
const { createDepartmentSchema, updateDepartmentSchema } = require('../validators/department.validator');
const mockData = require('../services/mockData.service');

const getAll = async (req, res, next) => {
  try {
    // MOCK MODE: Return mock departments if mock user
    if (req.user && req.user.id === 'mock-admin-id') {
      const mockDepts = mockData.generateMockDepartments();
      return res.json({ 
        success: true, 
        data: mockDepts, 
        total: mockDepts.length 
      });
    }

    const filters = { ...req.query };
    // If not admin, lock to user's branch
    const isAdmin = req.user?.role?.name?.toLowerCase().includes('admin');
    if (!isAdmin && req.user?.branch) {
      filters.branch = req.user.branch;
    }
    const result = await deptService.getAll(filters);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try {
    const { error } = createDepartmentSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const dept = await deptService.create(req.body, req.user.id);
    res.status(201).json({ success: true, data: dept });
  } catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    const { error } = updateDepartmentSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const dept = await deptService.update(req.params.id, req.body, req.user.id);
    res.json({ success: true, data: dept });
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    await deptService.remove(req.params.id, req.user.id);
    res.json({ success: true, message: 'Department deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, create, update, remove };
