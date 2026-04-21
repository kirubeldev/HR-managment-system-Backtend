const jwt = require('jsonwebtoken');
const { User, Role, Permission } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // MOCK MODE: Bypass DB check for the mock administrator
    if (decoded.userId === 'mock-admin-id') {
      req.user = {
        id: 'mock-admin-id',
        email: 'admin@hrms.com',
        role: 'Administrator',
        branch: 'HQ' // Default branch for mock admin
      };
      // Use permissions from token or fallback to a comprehensive list
      req.permissions = decoded.permissions || [
        'create_user', 'edit_user', 'delete_user', 'view_user',
        'create_employee', 'edit_employee', 'delete_employee', 'view_employee',
        'view_department', 'create_department', 'edit_department', 'delete_department',
        'view_audit_logs', 'manage_roles', 'manage_permissions',
        'view_student', 'create_student', 'edit_student', 'delete_student',
        'view_program', 'view_level'
      ];
      return next();
    }

    const user = await User.findOne({
      where: { id: decoded.userId, isDeleted: false, isActive: true },
      include: [{ model: Role, as: 'role', include: [{ model: Permission, as: 'permissions' }] }],
    });
    if (!user) return res.status(401).json({ success: false, message: 'User not found or inactive' });

    req.user = user;
    req.permissions = user.role.permissions.map(p => p.name);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = { authenticate };
