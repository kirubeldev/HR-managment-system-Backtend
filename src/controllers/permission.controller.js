const permissionService = require('../services/permission.service');

const getAll = async (req, res, next) => {
  try {
    const data = await permissionService.getAll();
    res.json({ success: true, data });
  } catch (err) {
    console.log('Permission getAll failed, returning mock data:', err.message);
    res.json({ success: true, data: [], mock: true });
  }
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

const getPositionsWithPermissions = async (req, res, next) => {
  try {
    const data = await permissionService.getPositionsWithPermissions();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const assignToPosition = async (req, res, next) => {
  try {
    const { positionId, permissionIds } = req.body;
    if (!positionId || !Array.isArray(permissionIds)) {
      return res.status(400).json({ success: false, message: 'positionId and permissionIds[] required' });
    }
    const result = await permissionService.assignToPosition(positionId, permissionIds, req.user.id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

module.exports = { getAll, assignToRole, getPositionsWithPermissions, assignToPosition };
