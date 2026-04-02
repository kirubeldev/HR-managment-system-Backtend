const { Employee, sequelize } = require('../models');
const { Op } = require('sequelize');

const getHiringTrends = async (year = new Date().getFullYear()) => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const trends = await Employee.findAll({
        attributes: [
            [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('hireDate')), 'month'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        where: {
            isDeleted: false,
            hireDate: {
                [Op.between]: [startDate, endDate],
            },
        },
        group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('hireDate'))],
        order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('hireDate')), 'ASC']],
        raw: true,
    });

    // Zero-fill all 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = months.map((m, i) => {
        const found = trends.find(t => new Date(t.month).getMonth() === i);
        return {
            month: m,
            count: found ? parseInt(found.count, 10) : 0,
        };
    });

    return result;
};

const getDepartmentDistribution = async () => {
    const { Department } = require('../models');
    const distribution = await Department.findAll({
        attributes: [
            'name',
            [sequelize.fn('COUNT', sequelize.col('employees.id')), 'count'],
        ],
        include: [{
            model: Employee,
            as: 'employees',
            attributes: [],
            where: { isDeleted: false },
            required: false,
        }],
        where: { isDeleted: false },
        group: ['Department.id', 'Department.name'],
        raw: true,
    });

    return distribution.map(d => ({
        name: d.name,
        value: parseInt(d.count, 10),
    }));
};

module.exports = {
    getHiringTrends,
    getDepartmentDistribution,
};
