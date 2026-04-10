const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  displayId: { type: DataTypes.STRING, allowNull: true, unique: true, field: 'displayid' }, // e.g., USR001
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  name: { type: DataTypes.STRING, allowNull: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  roleId: { type: DataTypes.UUID, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
  resetToken: { type: DataTypes.STRING, allowNull: true },
  resetTokenExpiry: { type: DataTypes.DATE, allowNull: true },
  otp: { type: DataTypes.STRING, allowNull: true },
  otpExpiry: { type: DataTypes.DATE, allowNull: true },
  activationToken: { type: DataTypes.STRING, allowNull: true },
  activationTokenExpiry: { type: DataTypes.DATE, allowNull: true },
  branch: { type: DataTypes.ENUM('enkulal fabrica', 'bole center'), allowNull: true },
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deletedAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'users', timestamps: true });

User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = User;
