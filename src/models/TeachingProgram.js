const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeachingProgram = sequelize.define('TeachingProgram', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    branch: { type: DataTypes.ENUM('enkulal fabrica', 'bole center'), allowNull: true },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'teaching_programs', timestamps: true });

module.exports = TeachingProgram;
