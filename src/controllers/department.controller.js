const deptService = require('../services/department.service');
const { createDepartmentSchema, updateDepartmentSchema } = require('../validators/department.validator');

const getAll = async (req, res, next) => {
  try {
    const result = await deptService.getAll(req.query);
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
