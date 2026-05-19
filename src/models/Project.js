const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  managerId: { type: DataTypes.UUID, allowNull: true },
  creationDate: { type: DataTypes.DATEONLY, allowNull: true },
  endDate: { 
    type: DataTypes.DATEONLY, 
    allowNull: true,
    validate: {
      isNotFuture(value) {
        if (value && new Date(value) > new Date()) {
          throw new Error('End date cannot be in the future');
        }
      }
    }
  },
  status: { 
    type: DataTypes.ENUM('active', 'inactive'), 
    defaultValue: 'active',
    set(value) {
      if (this.getDataValue('endDate')) {
        this.setDataValue('status', 'inactive');
      } else {
        this.setDataValue('status', value || 'active');
      }
    }
  },
  branch: { type: DataTypes.ENUM('enkulal fabrica', 'bole center'), allowNull: true },
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deletedAt: { type: DataTypes.DATE, allowNull: true },
}, { 
  tableName: 'projects', 
  timestamps: true,
  hooks: {
    beforeSave: (instance) => {
      if (instance.endDate) {
        instance.status = 'inactive';
      }
    }
  }
});

module.exports = Project;
