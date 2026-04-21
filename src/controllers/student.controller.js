const studentService = require('../services/student.service');
const auditLogService = require('../services/auditLog.service');
const mockData = require('../services/mockData.service');

const isAdmin = (user) => user?.role?.toLowerCase() === 'administrator' || user?.role?.name?.toLowerCase() === 'administrator';

class StudentController {
    async getAll(req, res, next) {
        try {
            // MOCK MODE: Return sample students if mock user
            if (req.user && req.user.id === 'mock-admin-id') {
                const mockStudents = mockData.generateMockStudents(10);
                return res.json({ 
                    success: true, 
                    data: mockStudents, 
                    total: mockStudents.length 
                });
            }

            const query = { ...req.query };
            
            // Branch isolation for non-admins
            if (!isAdmin(req.user)) {
                query.branch = req.user?.branch || null;
            }

            // Student Type Isolation
            const permissions = req.permissions || [];
            const hasFullView = permissions.includes('view_student');
            const hasChildView = permissions.includes('view_child');
            const hasTraineeView = permissions.includes('view_trainee');

            if (!hasFullView) {
                if (hasChildView && !hasTraineeView) {
                    query.type = 'child';
                } else if (!hasChildView && hasTraineeView) {
                    query.type = 'trainee';
                } else if (!hasChildView && !hasTraineeView) {
                    // This shouldn't happen due to router middleware, but for safety:
                    return res.status(403).json({ success: false, message: 'Unauthorized: No student view permission' });
                }
            }

            const students = await studentService.getAll(query);
            res.json(students);
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const student = await studentService.getById(req.params.id);
            const permissions = req.permissions || [];
            
            // Check type-level permission
            if (!permissions.includes('view_student')) {
                if (student.type === 'child' && !permissions.includes('view_child')) {
                    return res.status(403).json({ success: false, message: 'Permission denied for child students' });
                }
                if (student.type === 'trainee' && !permissions.includes('view_trainee')) {
                    return res.status(403).json({ success: false, message: 'Permission denied for trainee students' });
                }
            }
            
            res.json(student);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const permissions = req.permissions || [];
            const typeValue = req.body.type || 'trainee';

            if (!permissions.includes('create_student')) {
                if (typeValue === 'child' && !permissions.includes('create_child')) {
                    return res.status(403).json({ success: false, message: 'Not authorized to create child students' });
                }
                if (typeValue === 'trainee' && !permissions.includes('create_trainee')) {
                    return res.status(403).json({ success: false, message: 'Not authorized to create trainee students' });
                }
            }

            const student = await studentService.create(req.body);
            await auditLogService.log(req.user.id, 'CREATE', 'student', student.id, { fullName: student.fullName, type: student.type });
            res.status(201).json(student);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const student = await studentService.getById(req.params.id);
            const permissions = req.permissions || [];

            if (!permissions.includes('edit_student')) {
                if (student.type === 'child' && !permissions.includes('edit_child')) {
                    return res.status(403).json({ success: false, message: 'Not authorized to edit child students' });
                }
                if (student.type === 'trainee' && !permissions.includes('edit_trainee')) {
                    return res.status(403).json({ success: false, message: 'Not authorized to edit trainee students' });
                }
            }

            const updatedStudent = await studentService.update(req.params.id, req.body);
            await auditLogService.log(req.user.id, 'UPDATE', 'student', updatedStudent.id, { fullName: updatedStudent.fullName, type: updatedStudent.type });
            res.json(updatedStudent);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const student = await studentService.getById(req.params.id);
            const permissions = req.permissions || [];

            if (!permissions.includes('delete_student')) {
                if (student.type === 'child' && !permissions.includes('delete_child')) {
                    return res.status(403).json({ success: false, message: 'Not authorized to delete child students' });
                }
                if (student.type === 'trainee' && !permissions.includes('delete_trainee')) {
                    return res.status(403).json({ success: false, message: 'Not authorized to delete trainee students' });
                }
            }

            await studentService.delete(req.params.id);
            await auditLogService.log(req.user.id, 'DELETE', 'student', req.params.id, { fullName: student.fullName, type: student.type });
            res.json({ message: 'Student deleted successfully' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new StudentController();
