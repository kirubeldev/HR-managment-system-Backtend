const router = require('express').Router();
const ctrl = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permission');

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Main system dashboard stats
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard summary counts
 *     responses:
 *       200:
 *         description: Summary data
 */
router.get('/summary', ctrl.getSummary);

/**
 * @swagger
 * /api/dashboard/employee-by-department:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get employee count by department
 *     responses:
 *       200:
 *         description: Distribution data
 */
router.get('/employee-by-department', requirePermission('view_department'), ctrl.getEmployeeByDepartment);

/**
 * @swagger
 * /api/dashboard/employee-status:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get employee distribution by status
 *     responses:
 *       200:
 *         description: Status data
 */
router.get('/employee-status', requirePermission('view_employee'), ctrl.getEmployeeStatus);

/**
 * @swagger
 * /api/dashboard/hiring-trend:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get hiring trends by year
 *     parameters:
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Trend data
 */
router.get('/hiring-trend', requirePermission('view_employee'), ctrl.getHiringTrend);

/**
 * @swagger
 * /api/dashboard/users-by-role:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get user counts by role
 *     responses:
 *       200:
 *         description: Role distribution
 */
router.get('/users-by-role', requirePermission('view_user'), ctrl.getUsersByRole);

/**
 * @swagger
 * /api/dashboard/audit-logs:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get recent audit logs
 *     responses:
 *       200:
 *         description: Recent logs
 */
router.get('/audit-logs', requirePermission('view_audit_logs'), ctrl.getRecentLogs);

// New routes for additional charts
router.get('/student-age-distribution', ctrl.getStudentAgeDistribution);
router.get('/student-type-distribution', ctrl.getStudentTypeDistribution);
router.get('/leave-requests-by-month', ctrl.getLeaveRequestsByMonth);
router.get('/employee-branch-distribution', ctrl.getEmployeeBranchDistribution);
router.get('/leave-type-distribution', ctrl.getLeaveTypeDistribution);

module.exports = router;
