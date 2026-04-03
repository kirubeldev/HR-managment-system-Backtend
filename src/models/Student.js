const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    educationLevel: { type: DataTypes.STRING, allowNull: false },
    region: { type: DataTypes.STRING },
    subCity: { type: DataTypes.STRING },
    woreda: { type: DataTypes.STRING },
    kebele: { type: DataTypes.STRING },
    houseNumber: { type: DataTypes.STRING },
    nationality: { type: DataTypes.STRING },
    registrationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    phoneNumber: { type: DataTypes.STRING },
    profileImageUrl: { type: DataTypes.STRING, allowNull: true },
    documentUrl: { type: DataTypes.STRING, allowNull: true },
    teacherId: { type: DataTypes.UUID, allowNull: true },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'students', timestamps: true });

module.exports = Student;
