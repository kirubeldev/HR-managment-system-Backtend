const auditLogService = require('../services/auditLog.service');
const mockData = require('../services/mockData.service');

const getAll = async (req, res, next) => {
  try {
    // MOCK MODE: Return sample audit logs if mock user
    if (req.user && req.user.id === 'mock-admin-id') {
      const mockLogs = mockData.generateMockAuditLogs(10);
      return res.json({ 
        success: true, 
        data: mockLogs, 
        total: mockLogs.length 
      });
    }

    res.json({ success: true, ...(await auditLogService.getAll(req.query)) });
  } catch (err) { next(err); }
};

module.exports = { getAll };
