const positionService = require('../services/position.service');
const mockData = require('../services/mockData.service');

const getAll = async (req, res, next) => {
  try {
    // MOCK MODE: Return sample positions if mock user
    if (req.user && req.user.id === 'mock-admin-id') {
      const mockPositions = mockData.generateMockPositions();
      return res.json({ 
        success: true, 
        data: mockPositions, 
        total: mockPositions.length 
      });
    }

    const filters = { ...req.query };
    // If not admin, lock to user's branch
    const isAdmin = req.user?.role?.name?.toLowerCase().includes('admin');
    if (!isAdmin && req.user?.branch) {
      filters.branch = req.user.branch;
    }
    const result = await positionService.getAll(filters);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const position = await positionService.create(req.body, req.user?.id);
    res.status(201).json({ success: true, data: position });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const position = await positionService.update(req.params.id, req.body, req.user?.id);
    res.json({ success: true, data: position });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await positionService.remove(req.params.id, req.user?.id);
    res.json({ success: true, message: 'Position deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, create, update, remove };
