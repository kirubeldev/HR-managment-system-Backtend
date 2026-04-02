const dashboardService = require('../services/dashboard.service');
const analyticsService = require('../services/analytics.service');

const getSummary = async (req, res, next) => {
    try {
        const data = await dashboardService.getSummary();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getEmployeeByDepartment = async (req, res, next) => {
    try {
        const data = await analyticsService.getDepartmentDistribution();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getEmployeeStatus = async (req, res, next) => {
    try {
        const data = await dashboardService.getEmployeeStatusDistribution();
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

const getHiringTrend = async (req, res, next) => {
    try {
        const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();
        const data = await analyticsService.getHiringTrends(year);
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

module.exports = {
    getSummary,
    getEmployeeByDepartment,
    getEmployeeStatus,
    getHiringTrend,
    getUsersByRole,
    getRecentLogs
};
