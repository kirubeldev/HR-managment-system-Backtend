const { LeaveRequest, Student, Employee } = require('../models');

class LeaveRequestService {
    async getAll(query = {}) {
        const { status, studentId } = query;
        const where = {};

        if (status) where.status = status;
        if (studentId) where.studentId = studentId;

        return await LeaveRequest.findAll({
            where,
            include: [
                { 
                    model: Student, 
                    as: 'student', 
                    attributes: ['id', 'fullName', 'profileImageUrl'],
                    include: [
                        { model: Employee, as: 'teacher', attributes: ['id', 'firstName', 'lastName'] }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }

    async getById(id) {
        const leave = await LeaveRequest.findByPk(id, {
            include: [
                { 
                    model: Student, 
                    as: 'student', 
                    attributes: ['id', 'fullName', 'profileImageUrl'],
                    include: [
                        { model: Employee, as: 'teacher', attributes: ['id', 'firstName', 'lastName'] }
                    ]
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
