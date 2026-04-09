const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false },
  departmentId: { type: DataTypes.UUID, allowNull: true },
  hireDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isNotFuture(value) {
        if (new Date(value) > new Date()) {
          throw new Error('Hire date cannot be in the future');
        }
      }
    }
  },
  status: { type: DataTypes.ENUM('active', 'inactive', 'terminated', 'leave'), defaultValue: 'active' },
  profileImageUrl: { type: DataTypes.TEXT, allowNull: true },
  cvUrl: { type: DataTypes.TEXT, allowNull: true },
  idDocumentUrl: { type: DataTypes.TEXT, allowNull: true },
  dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
  gender: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  emergencyContactName: { type: DataTypes.STRING, allowNull: true },
  emergencyContactPhone: { type: DataTypes.STRING, allowNull: true },
  branch: { type: DataTypes.ENUM('enkulal fabrica', 'bole center'), allowNull: true },
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deletedAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'employees', timestamps: true });

module.exports = Employee;
