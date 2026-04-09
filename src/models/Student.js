const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    type: { type: DataTypes.ENUM('trainee', 'family'), defaultValue: 'trainee' },
    
    // Core Fields (Mainly for Trainee)
    fullName: { type: DataTypes.STRING, allowNull: true },
    educationLevel: { type: DataTypes.STRING, allowNull: true },
    
    // Family Fields
    firstName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, allowNull: true },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
    motherName: { type: DataTypes.STRING, allowNull: true },
    maritalStatus: { type: DataTypes.STRING, allowNull: true },
    numberOfChildren: { type: DataTypes.INTEGER, allowNull: true },
    employmentStatus: { type: DataTypes.STRING, allowNull: true },
    workDetails: { type: DataTypes.TEXT, allowNull: true },
    workWereda: { type: DataTypes.STRING, allowNull: true },
    childrenInCenter: { type: DataTypes.INTEGER, allowNull: true },
    monthlyIncome: { type: DataTypes.STRING, allowNull: true },

    // Common/Existing Fields
    age: { type: DataTypes.INTEGER, allowNull: true },
    gender: { type: DataTypes.STRING, allowNull: true },
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
    branch: { type: DataTypes.ENUM('enkulal fabrica', 'bole center'), allowNull: true },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'students', timestamps: true });

module.exports = Student;
