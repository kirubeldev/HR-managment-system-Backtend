const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Position = sequelize.define('Position', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false, unique: true },
  jobDescription: { type: DataTypes.TEXT, allowNull: true },
  branch: { type: DataTypes.ENUM('enkulal fabrica', 'bole center'), allowNull: true },
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deletedAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'positions', timestamps: true });

module.exports = Position;
