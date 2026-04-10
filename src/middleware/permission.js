const requirePermission = (permission) => (req, res, next) => {
  const allowedPermissions = Array.isArray(permission) ? permission : [permission];
  const hasPermission = allowedPermissions.some(p => req.permissions && req.permissions.includes(p));

  if (!hasPermission) {
    return res.status(403).json({
      success: false,
      message: `Permission denied: access requires one of [${allowedPermissions.join(', ')}]`,
    });
  }
  next();
};

module.exports = { requirePermission };
