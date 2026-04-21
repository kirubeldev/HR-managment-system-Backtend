const teachingProgramService = require('../services/teachingProgram.service');
const auditLogService = require('../services/auditLog.service');
const mockData = require('../services/mockData.service');

const isAdmin = (user) => user?.role?.toLowerCase() === 'administrator' || user?.role?.name?.toLowerCase() === 'administrator';

class TeachingProgramController {
    async getAll(req, res, next) {
        try {
            // MOCK MODE: Return sample programs if mock user
            if (req.user && req.user.id === 'mock-admin-id') {
                const mockProgs = mockData.generateMockPrograms(10);
                return res.json({ 
                    success: true, 
                    data: mockProgs, 
                    total: mockProgs.length 
                });
            }

            let branch = null;
            if (isAdmin(req.user)) {
                branch = req.query.branch || null; // Admin: optional filter
            } else {
                branch = req.user?.branch || null; // Non-admin: locked to their branch
            }
            const programs = await teachingProgramService.getAll(branch);
            res.json(programs);
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const program = await teachingProgramService.getById(req.params.id);
            res.json(program);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const program = await teachingProgramService.create(req.body);
            await auditLogService.log(req.user.id, 'CREATE', 'teaching_program', program.id, { name: program.name });
            res.status(201).json(program);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const program = await teachingProgramService.update(req.params.id, req.body);
            await auditLogService.log(req.user.id, 'UPDATE', 'teaching_program', program.id, { name: program.name });
            res.json(program);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            await teachingProgramService.delete(req.params.id);
            await auditLogService.log(req.user.id, 'DELETE', 'teaching_program', req.params.id);
            res.json({ message: 'Teaching program deleted successfully' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new TeachingProgramController();
