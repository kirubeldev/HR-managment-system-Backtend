const auditLogService = require('../services/auditLog.service');

const getAll = async (req, res, next) => {
  try { res.json({ success: true, ...(await auditLogService.getAll(req.query)) }); } catch (err) { next(err); }
};

module.exports = { getAll };
