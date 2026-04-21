const LeaveRequestService = require('../services/leaveRequest.service');
const mockData = require('../services/mockData.service');

const isAdmin = (user) => user?.role?.toLowerCase() === 'administrator' || user?.role?.name?.toLowerCase() === 'administrator';

class LeaveRequestController {
    async getAll(req, res, next) {
        try {
            // MOCK MODE: Return sample leave requests if mock user
            if (req.user && req.user.id === 'mock-admin-id') {
                const mockLeaves = mockData.generateMockLeaveRequests(10);
                return res.json({ 
                    success: true, 
                    data: mockLeaves, 
                    total: mockLeaves.length 
                });
            }

            const query = { ...req.query };
            console.log('Controller received query:', req.query);
            if (!isAdmin(req.user)) {
                query.branch = req.user?.branch || null;
                // Allow viewing null branches for transition period
                query.allowNullBranch = true;
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
            const isHR = req.user?.role?.name?.toLowerCase().includes('hr');
            const isAdmin = req.user?.role?.name?.toLowerCase() === 'administrator';
            
            if (!isHR && !isAdmin) {
                return res.status(403).json({ success: false, message: 'Only HR personnel or administrators can approve leave requests' });
            }
            
            // Get the leave request to check the requester's role
            const leave = await LeaveRequestService.getById(req.params.id);
            
            // If the requester is HR, only admin can approve
            const isRequesterHR = leave.employee?.role?.name?.toLowerCase().includes('hr');
            if (isRequesterHR && !isAdmin) {
                return res.status(403).json({ success: false, message: 'Only administrators can approve leave requests from HR personnel' });
            }
            
            const updatedLeave = await LeaveRequestService.updateStatus(req.params.id, req.body);
            res.status(200).json({ success: true, data: updatedLeave });
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

    async getBalance(req, res, next) {
        try {
            const balance = await LeaveRequestService.getLeaveBalance(req.params.employeeId);
            res.status(200).json({ success: true, data: balance });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new LeaveRequestController();
