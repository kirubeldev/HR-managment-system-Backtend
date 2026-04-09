const { LeaveRequest, Employee } = require('../models');
const { Op } = require('sequelize');

class LeaveRequestService {
    async getAll(query = {}) {
        const { status, employeeId, branch } = query;
        const where = {};

        if (status) where.status = status;
        if (employeeId) where.employeeId = employeeId;
        if (branch) where.branch = branch;

        return await LeaveRequest.findAll({
            where,
            include: [
                {
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'firstName', 'lastName', 'profileImageUrl', 'position']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }

    async getById(id) {
        const leave = await LeaveRequest.findByPk(id, {
            include: [
                {
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'firstName', 'lastName', 'profileImageUrl', 'position']
                }
            ]
        });
        if (!leave) throw new Error('Leave request not found');
        return leave;
    }

    async create(data) {
        return await LeaveRequest.create(data);
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
