const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, Role, Permission, RefreshToken } = require('../models');
const emailService = require('./email.service');

const generateAccessToken = (user) => {
  const permissions = user.role.permissions.map(p => p.name);
  return jwt.sign(
    { userId: user.id, email: user.email, roleId: user.roleId, roleName: user.role.name, permissions },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '24'));

  await RefreshToken.create({ token, userId, expiresAt });
  return token;
};

const login = async (email, password) => {
  const user = await User.findOne({
    where: { email, isDeleted: false },
    include: [{ model: Role, as: 'role', include: [{ model: Permission, as: 'permissions' }] }],
  });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  if (!user.isActive) throw Object.assign(new Error('Account not activated. Please check your email or use the activation link.'), { status: 403 });

  const valid = await user.validatePassword(password);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);

  return {
    token: accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role.name, permissions: user.role.permissions.map(p => p.name) }
  };
};

const refreshAccessToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({ where: { token }, include: [{ model: User, as: 'user', include: [{ model: Role, as: 'role', include: [{ model: Permission, as: 'permissions' }] }] }] });

  if (!refreshToken || refreshToken.expiresAt < new Date() || !refreshToken.user || !refreshToken.user.isActive) {
    throw Object.assign(new Error('Invalid or expired refresh token'), { status: 401 });
  }

  const accessToken = generateAccessToken(refreshToken.user);
  return { token: accessToken };
};

const setPassword = async (token, newPassword) => {
  const user = await User.findOne({ where: { resetToken: token, isDeleted: false } });
  if (!user || !user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
    throw Object.assign(new Error('Invalid or expired token'), { status: 400 });
  }
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await user.update({ passwordHash, resetToken: null, resetTokenExpiry: null, isActive: true });
  return { message: 'Password set successfully. You can now log in.' };
};

const generateResetToken = () => crypto.randomBytes(32).toString('hex');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email, isDeleted: false } });
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await user.update({ otp, otpExpiry });

  try {
    await emailService.sendOTPEmail(email, otp);
  } catch (err) {
    console.log('📧 Password Reset Email Error:', err.message);
    throw Object.assign(new Error('User found and OTP generated, but email service is currently unavailable. Please contact support or try again later.'), { status: 503 });
  }

  return { message: 'OTP sent to your email. Please check your inbox.' };
};

const resetPassword = async (email, otp, newPassword) => {
  const user = await User.findOne({ where: { email, isDeleted: false } });
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  if (user.otp !== otp || !user.otpExpiry || new Date() > user.otpExpiry) {
    throw Object.assign(new Error('Invalid or expired OTP'), { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await user.update({ passwordHash, otp: null, otpExpiry: null });

  return { message: 'Password reset successfully. You can now log in.' };
};

module.exports = { login, setPassword, generateResetToken, refreshAccessToken, forgotPassword, resetPassword, generateAccessToken, generateRefreshToken };
