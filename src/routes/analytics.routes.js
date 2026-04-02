const router = require('express').Router();
const ctrl = require('../controllers/analytics.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permission');

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: System analytics and reports
 */

router.use(authenticate);

/**
 * @swagger
 * /api/analytics/hiring-trends:
 *   get:
 *     tags: [Analytics]
 *     summary: Get hiring trends (count by month)
 *     parameters:
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Hiring trends data
 */
router.get('/hiring-trends', requirePermission('view_employee'), ctrl.getHiringTrends);

/**
 * @swagger
 * /api/analytics/department-distribution:
 *   get:
 *     tags: [Analytics]
 *     summary: Get employee distribution by department
 *     responses:
 *       200:
 *         description: Department distribution data
 */
router.get('/department-distribution', requirePermission('view_department'), ctrl.getDepartmentDistribution);

module.exports = router;
