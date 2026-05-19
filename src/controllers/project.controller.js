const projectService = require('../services/project.service');
const mockData = require('../services/mockData.service');

const getAll = async (req, res, next) => {
  try {
    // MOCK MODE: Return sample projects if mock user
    if (req.user && req.user.id === 'mock-admin-id') {
      const mockProjects = mockData.generateMockProjects(10);
      return res.json({ 
        success: true, 
        data: mockProjects, 
        total: mockProjects.length 
      });
    }

    const filters = { ...req.query };
    // If not admin, lock to user's branch
    const isAdmin = req.user?.role?.name?.toLowerCase().includes('admin');
    if (!isAdmin && req.user?.branch) {
      filters.branch = req.user.branch;
    }
    const result = await projectService.getAll(filters);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const project = await projectService.create(req.body, req.user?.id);
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const project = await projectService.update(req.params.id, req.body, req.user?.id);
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await projectService.remove(req.params.id, req.user?.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, create, update, remove };
