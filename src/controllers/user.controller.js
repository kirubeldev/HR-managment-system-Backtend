const userService = require('../services/user.service');
const { createUserSchema, updateUserSchema } = require('../validators/user.validator');

const getAll = async (req, res, next) => {
  try {
    const filters = { ...req.query };
    // If not super admin, force branch filter
    if (req.user && req.user.role && req.user.role.name !== 'Super Admin' && req.user.branch) {
      filters.branch = req.user.branch;
    }
    const result = await userService.getAll(filters);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { error } = createUserSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const result = await userService.create(req.body, req.user.id);
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { error } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const user = await userService.update(req.params.id, req.body, req.user.id);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await userService.remove(req.params.id, req.user.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await userService.getById(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

const updateMe = async (req, res, next) => {
  try {
    const { profileUpdateSchema } = require('../validators/user.validator');
    const { error } = profileUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const user = await userService.update(req.user.id, req.body, req.user.id);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove, getMe, updateMe };
