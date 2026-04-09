const { Student, TeachingProgram, Employee, LeaveRequest } = require('../models');
const { generateDisplayId } = require('../utils/idGenerator');
const { Op } = require('sequelize');

class StudentService {
    async getAll(query = {}) {
        const { search, branch, type, gender, educationLevel, maritalStatus } = query;
        const where = { isDeleted: false };

        if (search) {
            where[Op.or] = [
                { fullName: { [Op.iLike]: `%${search}%` } },
                { firstName: { [Op.iLike]: `%${search}%` } },
                { lastName: { [Op.iLike]: `%${search}%` } },
                { phoneNumber: { [Op.iLike]: `%${search}%` } },
                { displayId: { [Op.iLike]: `%${search}%` } },
            ];
        }
        if (branch) where.branch = branch;
        if (type) where.type = type;
        if (gender) where.gender = gender;
        if (educationLevel) where.educationLevel = educationLevel;
        if (maritalStatus) where.maritalStatus = maritalStatus;

        return await Student.findAll({
            where,
            include: [
                { model: Employee, as: 'teacher', attributes: ['id', 'firstName', 'lastName'] },
                { model: TeachingProgram, as: 'programs', through: { attributes: [] } }
            ],
            order: [['createdAt', 'DESC']]
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
        
        // Generate unique display ID
        const displayId = await generateDisplayId('STUDENT');
        
        const student = await Student.create({ ...studentData, displayId });
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
