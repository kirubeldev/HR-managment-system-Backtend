const roleService = require('../services/role.service');

// Mock roles with permissions for development when DB fails
const mockRoles = [
  {
    id: '11111111-1111-1111-1111-000000000001',
    name: 'SUPER_ADMIN',
    permissions: [
      { id: 'p1111111-1111-1111-1111-000000000000', name: 'all_permissions' },
      { id: 'p1111111-1111-1111-1111-000000000001', name: 'view_dashboard' },
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '11111111-1111-1111-1111-000000000002',
    name: 'ADMINISTRATOR',
    permissions: [
      { id: 'p1111111-1111-1111-1111-000000000000', name: 'all_permissions' },
      { id: 'p1111111-1111-1111-1111-000000000001', name: 'view_dashboard' },
      { id: 'p1111111-1111-1111-1111-000000000002', name: 'create_user' },
      { id: 'p1111111-1111-1111-1111-000000000003', name: 'edit_user' },
      { id: 'p1111111-1111-1111-1111-000000000004', name: 'delete_user' },
      { id: 'p1111111-1111-1111-1111-000000000005', name: 'view_user' },
      { id: 'p1111111-1111-1111-1111-000000000006', name: 'create_employee' },
      { id: 'p1111111-1111-1111-1111-000000000007', name: 'edit_employee' },
      { id: 'p1111111-1111-1111-1111-000000000008', name: 'delete_employee' },
      { id: 'p1111111-1111-1111-1111-000000000009', name: 'view_employee' },
      { id: 'p1111111-1111-1111-1111-000000000010', name: 'view_department' },
      { id: 'p1111111-1111-1111-1111-000000000011', name: 'create_department' },
      { id: 'p1111111-1111-1111-1111-000000000012', name: 'edit_department' },
      { id: 'p1111111-1111-1111-1111-000000000013', name: 'delete_department' },
      { id: 'p1111111-1111-1111-1111-000000000014', name: 'view_audit_logs' },
      { id: 'p1111111-1111-1111-1111-000000000015', name: 'manage_roles' },
      { id: 'p1111111-1111-1111-1111-000000000016', name: 'manage_permissions' },
      { id: 'p1111111-1111-1111-1111-000000000017', name: 'view_student' },
      { id: 'p1111111-1111-1111-1111-000000000018', name: 'create_student' },
      { id: 'p1111111-1111-1111-1111-000000000019', name: 'edit_student' },
      { id: 'p1111111-1111-1111-1111-000000000020', name: 'delete_student' },
      { id: 'p1111111-1111-1111-1111-000000000021', name: 'view_program' },
      { id: 'p1111111-1111-1111-1111-000000000022', name: 'create_program' },
      { id: 'p1111111-1111-1111-1111-000000000023', name: 'edit_program' },
      { id: 'p1111111-1111-1111-1111-000000000024', name: 'delete_program' },
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '11111111-1111-1111-1111-000000000003',
    name: 'HR_MANAGER',
    permissions: [
      { id: 'p1111111-1111-1111-1111-000000000005', name: 'view_user' },
      { id: 'p1111111-1111-1111-1111-000000000009', name: 'view_employee' },
      { id: 'p1111111-1111-1111-1111-000000000010', name: 'view_department' },
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

const getAll = async (req, res, next) => {
  try {
    const data = await roleService.getAll();
    res.json({ success: true, data });
  } catch (err) {
    console.log('Role getAll failed, returning mock data:', err.message);
    // Return mock data when database fails
    res.json({ success: true, data: mockRoles, mock: true });
  }
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
