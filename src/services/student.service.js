const { Student, TeachingProgram, Employee, LeaveRequest } = require('../models');

class StudentService {
    async getAll(query = {}) {
        const { search } = query;
        const where = { isDeleted: false };

        // Simple search implementation
        // if (search) { ... }

        return await Student.findAll({
            where,
            include: [
                { model: Employee, as: 'teacher', attributes: ['id', 'firstName', 'lastName'] },
                { model: TeachingProgram, as: 'programs', through: { attributes: [] } }
            ]
        });
    }

    async getById(id) {
        const student = await Student.findOne({
            where: { id, isDeleted: false },
            include: [
                { model: Employee, as: 'teacher', attributes: ['id', 'firstName', 'lastName'] },
                { model: TeachingProgram, as: 'programs', through: { attributes: [] } }
            ]
        });
        if (!student) throw new Error('Student not found');
        return student;
    }

    async create(data) {
        const { programIds, ...studentData } = data;
        const student = await Student.create(studentData);

        if (programIds && programIds.length > 0) {
            await student.setPrograms(programIds);
        }

        return await this.getById(student.id);
    }

    async update(id, data) {
        const { programIds, ...studentData } = data;
        const student = await this.getById(id);

        await student.update(studentData);

        if (programIds !== undefined) {
            await student.setPrograms(programIds);
        }

        return await this.getById(id);
    }

    async delete(id) {
        const student = await this.getById(id);
        return await student.update({ isDeleted: true, deletedAt: new Date() });
    }
}

module.exports = new StudentService();
