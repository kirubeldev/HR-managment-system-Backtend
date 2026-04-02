const requirePermission = (permission) => (req, res, next) => {
  if (!req.permissions || !req.permissions.includes(permission)) {
    return res.status(403).json({
      success: false,
      message: `Permission denied: '${permission}' required`,
    });
  }
  next();
};

module.exports = { requirePermission };
