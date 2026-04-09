const authService = require('../services/auth.service');
const { loginSchema, setPasswordSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validators/auth.validator');
const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');
const { sendActivationEmail } = require('../services/email.service');

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    
    const { email, password } = req.body;
    console.log(`🔑 Login attempt: ${email}`);
    
    // Call the real auth service for database-backed authentication
    const data = await authService.login(email, password);
    
    console.log('✅ Login successful');
    res.json({ 
      success: true,
      ...data
    });
    
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(err.status || 500).json({ 
      success: false, 
      message: err.message || 'Server error during login'
    });
  }
};

const bootstrapAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`🚀 Real Admin Bootstrap: ${email}`);

    const { Role, Permission, User } = require('../models');
    const { Op } = require('sequelize');
    
    const existingAdmin = await User.findOne({ 
      include: [{ 
        model: Role, 
        as: 'role', 
        where: { name: { [Op.iLike]: 'Administrator' } } 
      }] 
    });
    
    if (existingAdmin) return res.status(403).json({ success: false, message: 'Administrator already exists.' });

    let role = await Role.findOne({
      where: { name: { [Op.iLike]: 'Administrator' } }
    });

    if (!role) {
      role = await Role.create({
        id: '11111111-1111-1111-1111-000000000001',
        name: 'Administrator'
      });
    }

    const perms = await Permission.findAll();
    await role.setPermissions(perms);

    const crypto = require('crypto');
    const userId = crypto.randomUUID();
    const activationToken = crypto.randomBytes(32).toString('hex');
    const passwordHash = await require('bcryptjs').hash(password, 12);

    const user = await User.create({
      id: userId,
      email, 
      passwordHash, 
      name: 'System Administrator', 
      roleId: role.id, 
      isActive: false,
      branch: null,
      activationToken, 
      activationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    const activationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/activate?token=${activationToken}`;

    // Restoration: Send the activation email
    try {
      await sendActivationEmail(user.email, activationToken);
      console.log(`📧 Activation email sent successfully to: ${user.email}`);
    } catch (emailErr) {
      console.error('📧 Error sending activation email:', emailErr.message);
      // We continue because the link is still returned in the response for direct use
    }

    res.status(201).json({ 
      success: true, 
      message: 'Administrator created successfully! Please check your email.',
      activationLink,
      email: user.email,
      role: role.name
    });
  } catch (err) { 
    console.error('Bootstrap error:', err.message);
    
    // Consolidate errors into a single message for the frontend toast
    const errorDetails = err.errors ? err.errors.map(e => e.message).join('. ') : err.message;
    
    return res.status(400).json({ 
      success: false, 
      message: errorDetails 
    });
  }
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

const activateAccount = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ success: false, message: 'Token required' });

    const { User } = require('../models');
    const user = await User.findOne({ where: { activationToken: token, isDeleted: false } });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or already used token' });
    if (user.activationTokenExpiry && new Date() > user.activationTokenExpiry) return res.status(400).json({ success: false, message: 'Activation link has expired' });

    await user.update({ isActive: true, activationToken: null, activationTokenExpiry: null });
    
    res.json({ success: true, message: 'Your account has been activated successfully! You can now log in.' });
  } catch (err) { next(err); }
};

const testSuccess = async (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Test successful - backend is working!'
  });
};

module.exports = { login, setPassword, refresh, forgotPassword, resetPassword, bootstrapAdmin, activateAccount, testSuccess };
