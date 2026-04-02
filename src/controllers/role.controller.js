const roleService = require('../services/role.service');

const getAll = async (req, res, next) => {
  try { res.json({ success: true, data: await roleService.getAll() }); } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try {
    if (!req.body.name) return res.status(400).json({ success: false, message: 'name is required' });
    const role = await roleService.create(req.body.name, req.user.id);
    res.status(201).json({ success: true, data: role });
  } catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    const role = await roleService.update(req.params.id, req.body.name, req.user.id);
    res.json({ success: true, data: role });
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    await roleService.remove(req.params.id, req.user.id);
    res.json({ success: true, message: 'Role deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, create, update, remove };
