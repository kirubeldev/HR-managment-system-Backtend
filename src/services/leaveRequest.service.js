const { LeaveRequest, Employee, Role, sequelize } = require('../models');
const { generateDisplayId } = require('../utils/idGenerator');
const { Op } = require('sequelize');
const emailService = require('./email.service');

class LeaveRequestService {
    async getAll(query = {}) {
        const { status, employeeId, branch, leaveType, search, limit = 10, page = 1, sortField = 'createdAt', sortOrder = 'DESC' } = query;
        const where = {};

        if (status) where.status = status;
        if (employeeId) where.employeeId = employeeId;
        if (leaveType && leaveType !== 'all') where.leaveType = leaveType;
        
        const andConditions = [];

        if (search) {
            andConditions.push({
                [Op.or]: [
                    { displayId: { [Op.iLike]: `%${search}%` } },
                    { reason: { [Op.iLike]: `%${search}%` } },
                    { '$employee.firstName$': { [Op.iLike]: `%${search}%` } },
                    { '$employee.lastName$': { [Op.iLike]: `%${search}%` } }
                ]
            });
        }
        
        const includeOptions = [
            {
                model: Employee,
                as: 'employee',
                attributes: ['id', 'firstName', 'lastName', 'profileImageUrl', 'position', 'branch', 'hireDate']
            }
        ];

        // Handle branch filtering
        if (branch) {
            if (query.allowNullBranch) {
                andConditions.push({
                    [Op.or]: [{ branch: branch }, { branch: null }]
                });
            } else {
                includeOptions[0].where = { branch: branch };
                andConditions.push({
                    [Op.or]: [
                        { branch: branch },
                        { branch: null }
                    ]
                });
            }
        }

        if (andConditions.length > 0) {
            where[Op.and] = andConditions;
        }

        const shouldPaginate = limit !== '0' && limit !== 0;
        
        const validSortFields = ['createdAt', 'startDate', 'endDate', 'status', 'leaveType'];
        const actualSortField = validSortFields.includes(sortField) ? sortField : 'createdAt';
        const actualSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        let orderClause;
        if (actualSortField === 'createdAt') {
            orderClause = [
                [sequelize.literal(`ABS(EXTRACT(EPOCH FROM ("LeaveRequest"."createdAt" - NOW())))`), 'ASC']
            ];
        } else {
            orderClause = [[actualSortField, actualSortOrder]];
        }
        
        const queryOptions = {
            where,
            include: includeOptions,
            order: orderClause
        };
        
        if (shouldPaginate) {
            queryOptions.limit = Number(limit);
            queryOptions.offset = (page - 1) * limit;
        }

        const leaves = await LeaveRequest.findAll(queryOptions);
        
        const countOptions = { where };
        if (includeOptions[0].where) {
            countOptions.include = includeOptions;
            countOptions.distinct = true;
        }
        const count = await LeaveRequest.count(countOptions);

        return shouldPaginate 
            ? { total: count, page: Number(page), limit: Number(limit), data: leaves }
            : { total: count, data: leaves };
    }

    async getById(id) {
        const leave = await LeaveRequest.findByPk(id, {
            include: [
                {
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'firstName', 'lastName', 'profileImageUrl', 'position', 'branch', 'email', 'hireDate'],
                }
            ]
        });
        if (!leave) throw new Error('Leave request not found');
        return leave;
    }

    async create(data) {
        const employee = await Employee.findByPk(data.employeeId);
        if (!employee) throw Object.assign(new Error('Employee not found'), { status: 404 });

        // Balance check — only for Annual leave type (others like Sick/Emergency are not balance-limited)
        const totalDays = Number(data.totalDays) || 0;
        const balance = await this.getLeaveBalance(data.employeeId);
        if (totalDays > balance.available) {
            throw Object.assign(
                new Error(`Insufficient leave balance. Requested ${totalDays} days but only ${balance.available} days available.`),
                { status: 400 }
            );
        }

        const branch = employee.branch;
        const displayId = await generateDisplayId('LEAVE');
        return await LeaveRequest.create({ ...data, branch, displayId });
    }

    async updateStatus(id, { status, supervisorComment, supervisorName }) {
        const leave = await this.getById(id);
        const updateData = { status };
        if (supervisorComment) updateData.supervisorComment = supervisorComment;
        if (supervisorName) updateData.supervisorName = supervisorName;
        await leave.update(updateData);
        
        // Send email notification to employee
        try {
            if (leave.employee && leave.employee.email) {
                const employeeName = `${leave.employee.firstName} ${leave.employee.lastName}`;
                await emailService.sendLeaveStatusEmail(
                    leave.employee.email,
                    employeeName,
                    status,
                    {
                        leaveType: leave.leaveType,
                        startDate: leave.startDate,
                        endDate: leave.endDate,
                        totalDays: leave.totalDays
                    }
                );
            }
        } catch (emailErr) {
            console.log('Failed to send leave status email:', emailErr.message);
        }
        
        return await this.getById(id);
    }

    async getLeaveBalance(employeeId) {
        const employee = await Employee.findByPk(employeeId);
        if (!employee) throw new Error('Employee not found');

        const hireDate = new Date(employee.hireDate);
        const now = new Date();

        // Edge case: future hire date
        if (hireDate > now) {
            return {
                employeeId,
                employeeName: `${employee.firstName} ${employee.lastName}`,
                hireDate: employee.hireDate,
                yearsOfService: 0,
                totalEntitlement: 0,
                totalTaken: 0,
                available: 0,
            };
        }

        // Full years completed + current partial year (each started year = 15 days)
        const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
        const exactYears = (now - hireDate) / msPerYear;
        const yearsOfService = Math.max(1, Math.ceil(exactYears));
        const totalEntitlement = yearsOfService * 15;

        // Only count Approved leave days
        const totalTaken = (await LeaveRequest.sum('totalDays', {
            where: { employeeId, status: 'Approved' },
        })) || 0;

        const available = Math.max(0, totalEntitlement - totalTaken);

        return {
            employeeId,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            hireDate: employee.hireDate,
            yearsOfService,
            totalEntitlement,
            totalTaken,
            available,
        };
    }

    async delete(id) {
        const leave = await LeaveRequest.findByPk(id);
        if (!leave) throw Object.assign(new Error('Leave request not found'), { status: 404 });
        await leave.destroy();
        return { success: true };
    }
}

module.exports = new LeaveRequestService();
