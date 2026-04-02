const analyticsService = require('../services/analytics.service');

const getHiringTrends = async (req, res, next) => {
    try {
        const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();
        const data = await analyticsService.getHiringTrends(year);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

const getDepartmentDistribution = async (req, res, next) => {
    try {
        const data = await analyticsService.getDepartmentDistribution();
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getHiringTrends,
    getDepartmentDistribution,
};
