const { Employee, Department, User, Role, AuditLog, Student, TeachingProgram, LeaveRequest, sequelize } = require('../models');
const { Op } = require('sequelize');

const getSummary = async () => {
    const [
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        totalDepartments,
        totalUsers,
        activeRoles,
        totalStudents,
        totalPrograms,
        pendingLeaves
    ] = await Promise.all([
        Employee.count({ where: { isDeleted: false } }),
        Employee.count({ where: { isDeleted: false, status: 'active' } }),
        Employee.count({ where: { isDeleted: false, status: { [Op.ne]: 'active' } } }),
        Department.count({ where: { isDeleted: false } }),
        User.count({ where: { isDeleted: false } }),
        Role.count({ where: { isDeleted: false } }),
        Student.count({ where: { isDeleted: false } }),
        TeachingProgram.count({ where: { isDeleted: false } }),
        LeaveRequest.count({ where: { status: 'Pending' } })
    ]);

    return {
        employees: { total: totalEmployees, active: activeEmployees, inactive: inactiveEmployees },
        departments: totalDepartments,
        users: totalUsers,
        roles: activeRoles,
        students: totalStudents,
        programs: totalPrograms,
        pendingLeaves: pendingLeaves
    };
};

const getEmployeeStatusDistribution = async () => {
    const distribution = await Employee.findAll({
        attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: { isDeleted: false },
        group: ['status'],
        raw: true
    });

    return distribution.map(d => ({
        name: d.status.charAt(0).toUpperCase() + d.status.slice(1),
        value: parseInt(d.count, 10)
    }));
};

const getUsersByRole = async () => {
    const roles = await Role.findAll({
        attributes: [
            'name',
            [sequelize.fn('COUNT', sequelize.col('users.id')), 'count']
        ],
        include: [{
            model: User,
            as: 'users',
            attributes: [],
            where: { isDeleted: false },
            required: false
        }],
        where: { isDeleted: false },
        group: ['Role.id', 'Role.name'],
        raw: true
    });

    return roles.map(r => ({
        role: r.name,
        count: parseInt(r.count, 10)
    }));
};

const getRecentLogs = async (limit = 5) => {
    return AuditLog.findAll({
        limit,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['id', 'email'] }]
    });
};

module.exports = {
    getSummary,
    getEmployeeStatusDistribution,
    getUsersByRole,
    getRecentLogs
};
