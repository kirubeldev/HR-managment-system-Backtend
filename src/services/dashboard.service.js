const { Employee, Department, User, Role, AuditLog, Student, TeachingProgram, LeaveRequest, sequelize } = require('../models');
const { Op } = require('sequelize');

const getSummary = async (branch = null) => {
    const employeeWhere = { isDeleted: false };
    const studentWhere = { isDeleted: false };
    const programWhere = { isDeleted: false };
    const leaveWhere = { status: 'Pending' };

    if (branch) {
        employeeWhere.branch = branch;
        studentWhere.branch = branch;
        programWhere.branch = branch;
        leaveWhere.branch = branch;
    }

    const [
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        totalDepartments,
        totalUsers,
        activeRoles,
        totalStudents,
        totalTrainees,
        totalChildren,
        totalPrograms,
        pendingLeaves
    ] = await Promise.all([
        Employee.count({ where: employeeWhere }),
        Employee.count({ where: { ...employeeWhere, status: 'active' } }),
        Employee.count({ where: { ...employeeWhere, status: { [Op.ne]: 'active' } } }),
        Department.count({ where: { isDeleted: false } }),
        User.count({ where: { isDeleted: false } }),
        Role.count({ where: { isDeleted: false } }),
        Student.count({ where: studentWhere }),
        Student.count({ where: { ...studentWhere, type: 'trainee' } }),
        Student.count({ where: { ...studentWhere, type: 'child' } }),
        TeachingProgram.count({ where: programWhere }),
        LeaveRequest.count({ where: leaveWhere })
    ]);

    return {
        employees: { total: totalEmployees, active: activeEmployees, inactive: inactiveEmployees },
        departments: totalDepartments,
        users: totalUsers,
        roles: activeRoles,
        students: { 
            total: totalStudents, 
            trainees: totalTrainees, 
            children: totalChildren 
        },
        programs: totalPrograms,
        pendingLeaves: pendingLeaves
    };
};

const getEmployeeStatusDistribution = async (branch = null) => {
    const where = { isDeleted: false };
    if (branch) where.branch = branch;

    const distribution = await Employee.findAll({
        attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
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

// New service methods for additional charts
const getStudentAgeDistribution = async (branch = null) => {
    const where = { isDeleted: false, age: { [Op.not]: null } };
    if (branch) where.branch = branch;

    const distribution = await Student.findAll({
        attributes: [
            [sequelize.literal(`CASE 
                WHEN age < 18 THEN 'Under 18'
                WHEN age BETWEEN 18 AND 25 THEN '18-25'
                WHEN age BETWEEN 26 AND 35 THEN '26-35'
                WHEN age BETWEEN 36 AND 45 THEN '36-45'
                ELSE 'Over 45'
            END`), 'ageGroup'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: [
            sequelize.literal(`CASE 
                WHEN age < 18 THEN 'Under 18'
                WHEN age BETWEEN 18 AND 25 THEN '18-25'
                WHEN age BETWEEN 26 AND 35 THEN '26-35'
                WHEN age BETWEEN 36 AND 45 THEN '36-45'
                ELSE 'Over 45'
            END`)
        ],
        raw: true
    });

    return distribution.map(d => ({
        name: d.ageGroup,
        count: parseInt(d.count, 10)
    }));
};

const getStudentTypeDistribution = async (branch = null) => {
    const where = { isDeleted: false };
    if (branch) where.branch = branch;

    const distribution = await Student.findAll({
        attributes: [
            'type',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: ['type'],
        raw: true
    });

    return distribution.map(d => ({
        name: d.type.charAt(0).toUpperCase() + d.type.slice(1),
        count: parseInt(d.count, 10)
    }));
};

const getLeaveRequestsByMonth = async (year = new Date().getFullYear(), branch = null) => {
    const where = {};
    const includeOptions = [
        {
            model: Employee,
            as: 'employee',
            attributes: [],
            where: branch ? { branch: branch } : undefined,
            required: false
        }
    ];

    if (branch) {
        where[Op.or] = [{ branch: branch }, { branch: null }];
    }

    const monthlyData = await LeaveRequest.findAll({
        attributes: [
            [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "LeaveRequest"."createdAt"')), 'month'],
            'status',
            [sequelize.fn('COUNT', sequelize.col('LeaveRequest.id')), 'count']
        ],
        where: {
            ...where,
            [Op.and]: [
                sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "LeaveRequest"."createdAt"')), year)
            ]
        },
        include: includeOptions,
        group: [
            sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "LeaveRequest"."createdAt"')),
            'status'
        ],
        order: [
            [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "LeaveRequest"."createdAt"')), 'ASC']
        ],
        raw: true
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = monthNames.map((month, index) => {
        const monthNum = index + 1;
        const pending = monthlyData.find(d => parseInt(d.month) === monthNum && d.status === 'Pending');
        const approved = monthlyData.find(d => parseInt(d.month) === monthNum && d.status === 'Approved');
        const rejected = monthlyData.find(d => parseInt(d.month) === monthNum && d.status === 'Rejected');

        return {
            month,
            approved: approved ? parseInt(approved.count, 10) : 0,
            pending: pending ? parseInt(pending.count, 10) : 0,
            rejected: rejected ? parseInt(rejected.count, 10) : 0,
            total: (approved ? parseInt(approved.count, 10) : 0) + 
                   (pending ? parseInt(pending.count, 10) : 0) + 
                   (rejected ? parseInt(rejected.count, 10) : 0)
        };
    });

    return result;
};

const getEmployeeBranchDistribution = async () => {
    const distribution = await Employee.findAll({
        attributes: [
            'branch',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: { isDeleted: false, branch: { [Op.not]: null } },
        group: ['branch'],
        raw: true
    });

    return distribution.map(d => ({
        name: d.branch.charAt(0).toUpperCase() + d.branch.slice(1),
        count: parseInt(d.count, 10)
    }));
};

const getLeaveTypeDistribution = async (branch = null) => {
    const where = {};
    const includeOptions = [
        {
            model: Employee,
            as: 'employee',
            attributes: [],
            where: branch ? { branch: branch } : undefined,
            required: false
        }
    ];

    if (branch) {
        where[Op.or] = [{ branch: branch }, { branch: null }];
    }

    const distribution = await LeaveRequest.findAll({
        attributes: [
            'leaveType',
            [sequelize.fn('COUNT', sequelize.col('LeaveRequest.id')), 'count']
        ],
        where,
        include: includeOptions,
        group: ['leaveType'],
        raw: true
    });

    return distribution.map(d => ({
        name: d.leaveType,
        count: parseInt(d.count, 10)
    }));
};

module.exports = {
    getSummary,
    getEmployeeStatusDistribution,
    getUsersByRole,
    getRecentLogs,
    getStudentAgeDistribution,
    getStudentTypeDistribution,
    getLeaveRequestsByMonth,
    getEmployeeBranchDistribution,
    getLeaveTypeDistribution
};
