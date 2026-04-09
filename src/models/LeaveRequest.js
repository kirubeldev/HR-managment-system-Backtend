const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveRequest = sequelize.define('LeaveRequest', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employeeId: { type: DataTypes.UUID, allowNull: false },
    leaveType: {
        type: DataTypes.ENUM('Annual', 'Sick', 'Maternity', 'Paternity', 'Emergency', 'Other'),
        allowNull: false,
    },
    reason: { type: DataTypes.TEXT },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    totalDays: { type: DataTypes.INTEGER, allowNull: false },
    handoverDetails: { type: DataTypes.TEXT },
    contactDetails: { type: DataTypes.STRING },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending',
    },
    supervisorName: { type: DataTypes.STRING },
    supervisorComment: { type: DataTypes.TEXT },
    branch: { type: DataTypes.ENUM('enkulal fabrica', 'bole center'), allowNull: true },
}, { tableName: 'leave_requests', timestamps: true });

module.exports = LeaveRequest;
