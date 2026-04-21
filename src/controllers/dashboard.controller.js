const dashboardService = require('../services/dashboard.service');
const analyticsService = require('../services/analytics.service');
const mockData = require('../services/mockData.service');

const isAdmin = (user) => user?.role?.name?.toLowerCase() === 'administrator';

const getBranchFilter = (req) => {
    if (isAdmin(req.user)) {
        // Admin can optionally filter by branch via query param, or see all
        return req.query.branch || null;
    }
    // Non-admin always sees only their own branch
    return req.user?.branch || null;
};

const getSummary = async (req, res, next) => {
    try {
        // MOCK MODE: Return dummy statistics if mock user or DB offline
        if (req.user && req.user.id === 'mock-admin-id') {
            return res.json({
                success: true,
                data: mockData.generateMockDashboardStats(),
                branch: 'HQ'
            });
        }

        const branch = getBranchFilter(req);
        const data = await dashboardService.getSummary(branch);
        res.json({ success: true, data, branch: branch || 'all' });
    } catch (err) { next(err); }
};

const getEmployeeByDepartment = async (req, res, next) => {
    try {
        if (req.user && req.user.id === 'mock-admin-id') {
            return res.json({ success: true, data: mockData.generateMockChartData.departmentDistribution });
        }
        const branch = getBranchFilter(req);
        const data = await analyticsService.getDepartmentDistribution(branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getEmployeeStatus = async (req, res, next) => {
    try {
        if (req.user && req.user.id === 'mock-admin-id') {
            return res.json({ success: true, data: mockData.generateMockChartData.statusDistribution });
        }
        const branch = getBranchFilter(req);
        const data = await dashboardService.getEmployeeStatusDistribution(branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getHiringTrend = async (req, res, next) => {
    try {
        if (req.user && req.user.id === 'mock-admin-id') {
            return res.json({ success: true, data: mockData.generateMockChartData.hiringTrends });
        }
        const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();
        const branch = getBranchFilter(req);
        const data = await analyticsService.getHiringTrends(year, branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getUsersByRole = async (req, res, next) => {
    try {
        if (req.user && req.user.id === 'mock-admin-id') {
            return res.json({ success: true, data: [
                { role: 'Administrator', count: 2 },
                { role: 'HR Manager', count: 5 },
                { role: 'Employee', count: 143 }
            ]});
        }
        const data = await dashboardService.getUsersByRole();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getRecentLogs = async (req, res, next) => {
    try {
        if (req.user && req.user.id === 'mock-admin-id') {
            return res.json({ success: true, data: mockData.generateMockAuditLogs(5) });
        }
        const data = await dashboardService.getRecentLogs();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

// New controller methods for additional charts
const getStudentAgeDistribution = async (req, res, next) => {
    try {
        if (req.user && req.user.id === 'mock-admin-id') {
            return res.json({ success: true, data: mockData.generateMockChartData.studentAgeDistribution });
        }
        const branch = getBranchFilter(req);
        const data = await dashboardService.getStudentAgeDistribution(branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getStudentTypeDistribution = async (req, res, next) => {
    try {
        if (req.user && req.user.id === 'mock-admin-id') {
            return res.json({ success: true, data: [
                { type: 'child', count: 150 },
                { type: 'trainee', count: 110 }
            ]});
        }
        const branch = getBranchFilter(req);
        const data = await dashboardService.getStudentTypeDistribution(branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getLeaveRequestsByMonth = async (req, res, next) => {
    try {
        if (req.user && req.user.id === 'mock-admin-id') {
            return res.json({ success: true, data: mockData.generateMockChartData.hiringTrends }); // Reuse hiring trend for sample
        }
        const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();
        const branch = getBranchFilter(req);
        const data = await dashboardService.getLeaveRequestsByMonth(year, branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getEmployeeBranchDistribution = async (req, res, next) => {
    try {
        if (req.user && req.user.id === 'mock-admin-id') {
            return res.json({ success: true, data: [
                { branch: 'Enkulal Fabrica', count: 85 },
                { branch: 'Bole Center', count: 65 }
            ]});
        }
        const data = await dashboardService.getEmployeeBranchDistribution();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getLeaveTypeDistribution = async (req, res, next) => {
    try {
        if (req.user && req.user.id === 'mock-admin-id') {
            return res.json({ success: true, data: mockData.generateMockChartData.leaveTypeDistribution });
        }
        const branch = getBranchFilter(req);
        const data = await dashboardService.getLeaveTypeDistribution(branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getVocTraineeGenderDistribution = async (req, res, next) => {
    try {
        if (req.user && req.user.id === 'mock-admin-id') {
            return res.json({ success: true, data: mockData.generateMockChartData.genderDistribution });
        }
        const branch = getBranchFilter(req);
        const data = await dashboardService.getVocTraineeGenderDistribution(branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

module.exports = {
    getSummary,
    getEmployeeByDepartment,
    getEmployeeStatus,
    getHiringTrend,
    getUsersByRole,
    getRecentLogs,
    getStudentAgeDistribution,
    getStudentTypeDistribution,
    getLeaveRequestsByMonth,
    getEmployeeBranchDistribution,
    getLeaveTypeDistribution,
    getVocTraineeGenderDistribution
};
