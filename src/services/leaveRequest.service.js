const { LeaveRequest, Employee } = require('../models');
const { Op } = require('sequelize');

class LeaveRequestService {
    async getAll(query = {}) {
        const { status, employeeId, branch } = query;
        const where = {};

        if (status) where.status = status;
        if (employeeId) where.employeeId = employeeId;
        
        const includeOptions = [
            {
                model: Employee,
                as: 'employee',
                attributes: ['id', 'firstName', 'lastName', 'profileImageUrl', 'position', 'branch']
            }
        ];

        // Handle branch filtering
        if (branch) {
            if (query.allowNullBranch) {
                // For non-admin users, include both direct branch matches and null branches
                where[Op.or] = [{ branch: branch }, { branch: null }];
            } else {
                // For admin users, filter by employee branch when leave branch is null
                // This is more complex - we need to use a subquery or different approach
                includeOptions[0].where = {
                    branch: branch
                };
                // Include leave requests that have the branch set directly OR have null branch but employee has the branch
                where[Op.or] = [
                    { branch: branch },
                    { branch: null }
                ];
            }
        }

        return await LeaveRequest.findAll({
            where,
            include: includeOptions,
            order: [['createdAt', 'DESC']]
        });
    }

    async getById(id) {
        const leave = await LeaveRequest.findByPk(id, {
            include: [
                {
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'firstName', 'lastName', 'profileImageUrl', 'position', 'branch']
                }
            ]
        });
        if (!leave) throw new Error('Leave request not found');
        return leave;
    }

    async create(data) {
        const employee = await Employee.findByPk(data.employeeId);
        const branch = employee ? employee.branch : null;
        return await LeaveRequest.create({ ...data, branch });
    }

    async updateStatus(id, { status, supervisorComment, supervisorName }) {
        const leave = await this.getById(id);
        const updateData = { status };
        if (supervisorComment) updateData.supervisorComment = supervisorComment;
        if (supervisorName) updateData.supervisorName = supervisorName;
        await leave.update(updateData);
        return await this.getById(id);
    }

    async delete(id) {
        const leave = await this.getById(id);
        await leave.destroy();
        return { success: true };
    }
}

module.exports = new LeaveRequestService();
