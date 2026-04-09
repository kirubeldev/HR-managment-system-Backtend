const dashboardService = require('../services/dashboard.service');
const analyticsService = require('../services/analytics.service');

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
        const branch = getBranchFilter(req);
        const data = await dashboardService.getSummary(branch);
        res.json({ success: true, data, branch: branch || 'all' });
    } catch (err) { next(err); }
};

const getEmployeeByDepartment = async (req, res, next) => {
    try {
        const branch = getBranchFilter(req);
        const data = await analyticsService.getDepartmentDistribution(branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getEmployeeStatus = async (req, res, next) => {
    try {
        const branch = getBranchFilter(req);
        const data = await dashboardService.getEmployeeStatusDistribution(branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getHiringTrend = async (req, res, next) => {
    try {
        const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();
        const branch = getBranchFilter(req);
        const data = await analyticsService.getHiringTrends(year, branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getUsersByRole = async (req, res, next) => {
    try {
        const data = await dashboardService.getUsersByRole();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getRecentLogs = async (req, res, next) => {
    try {
        const data = await dashboardService.getRecentLogs();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

// New controller methods for additional charts
const getStudentAgeDistribution = async (req, res, next) => {
    try {
        const branch = getBranchFilter(req);
        const data = await dashboardService.getStudentAgeDistribution(branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getStudentTypeDistribution = async (req, res, next) => {
    try {
        const branch = getBranchFilter(req);
        const data = await dashboardService.getStudentTypeDistribution(branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getLeaveRequestsByMonth = async (req, res, next) => {
    try {
        const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();
        const branch = getBranchFilter(req);
        const data = await dashboardService.getLeaveRequestsByMonth(year, branch);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getEmployeeBranchDistribution = async (req, res, next) => {
    try {
        const data = await dashboardService.getEmployeeBranchDistribution();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getLeaveTypeDistribution = async (req, res, next) => {
    try {
        const branch = getBranchFilter(req);
        const data = await dashboardService.getLeaveTypeDistribution(branch);
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
    getLeaveTypeDistribution
};
