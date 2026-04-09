const studentService = require('../services/student.service');
const auditLogService = require('../services/auditLog.service');

const isAdmin = (user) => user?.role?.name?.toLowerCase() === 'administrator';

class StudentController {
    async getAll(req, res, next) {
        try {
            const query = { ...req.query };
            // Non-admin: locked to their branch
            if (!isAdmin(req.user)) {
                query.branch = req.user?.branch || null;
            }
            // Admin: can pass ?branch= or see all (no override)
            const students = await studentService.getAll(query);
            res.json(students);
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const student = await studentService.getById(req.params.id);
            res.json(student);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const student = await studentService.create(req.body);
            await auditLogService.log(req.user.id, 'CREATE', 'student', student.id, { fullName: student.fullName });
            res.status(201).json(student);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const student = await studentService.update(req.params.id, req.body);
            await auditLogService.log(req.user.id, 'UPDATE', 'student', student.id, { fullName: student.fullName });
            res.json(student);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            await studentService.delete(req.params.id);
            await auditLogService.log(req.user.id, 'DELETE', 'student', req.params.id);
            res.json({ message: 'Student deleted successfully' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new StudentController();
