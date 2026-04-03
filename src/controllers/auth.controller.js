const authService = require('../services/auth.service');
const { loginSchema, setPasswordSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validators/auth.validator');

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const result = await authService.login(req.body.email, req.body.password);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const setPassword = async (req, res, next) => {
  try {
    const { error } = setPasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const result = await authService.setPassword(req.body.token, req.body.password);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required' });
    const data = await authService.refreshAccessToken(refreshToken);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const result = await authService.forgotPassword(req.body.email);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const resetPassword = async (req, res, next) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const result = await authService.resetPassword(req.body.email, req.body.otp, req.body.password);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

module.exports = { login, setPassword, refresh, forgotPassword, resetPassword };
