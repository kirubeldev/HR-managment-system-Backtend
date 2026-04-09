const LeaveRequestService = require('../services/leaveRequest.service');

const isAdmin = (user) => user?.role?.name?.toLowerCase() === 'administrator';

class LeaveRequestController {
    async getAll(req, res, next) {
        try {
            const query = { ...req.query };
            if (!isAdmin(req.user)) {
                query.branch = req.user?.branch || null;
            }
            // Admin: can pass ?branch= or see all (no override)
            const leaves = await LeaveRequestService.getAll(query);
            res.status(200).json({ success: true, data: leaves });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const leave = await LeaveRequestService.getById(req.params.id);
            res.status(200).json({ success: true, data: leave });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const leave = await LeaveRequestService.create(req.body);
            res.status(201).json({ success: true, data: leave });
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req, res, next) {
        try {
            const leave = await LeaveRequestService.updateStatus(req.params.id, req.body);
            res.status(200).json({ success: true, data: leave });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await LeaveRequestService.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Leave request deleted' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new LeaveRequestController();
