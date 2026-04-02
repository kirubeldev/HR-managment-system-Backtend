const permissionService = require('../services/permission.service');

const getAll = async (req, res, next) => {
  try { res.json({ success: true, data: await permissionService.getAll() }); } catch (err) { next(err); }
};

const assignToRole = async (req, res, next) => {
  try {
    const { roleId, permissionIds } = req.body;
    if (!roleId || !Array.isArray(permissionIds)) {
      return res.status(400).json({ success: false, message: 'roleId and permissionIds[] required' });
    }
    const result = await permissionService.assignToRole(roleId, permissionIds, req.user.id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

module.exports = { getAll, assignToRole };
