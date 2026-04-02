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
