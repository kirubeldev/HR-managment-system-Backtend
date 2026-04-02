const router = require('express').Router();
const ctrl = require('../controllers/auditLog.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permission');

router.use(authenticate);
/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     tags: [Audit Logs]
 *     summary: List all audit logs (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *       - in: query
 *         name: action
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Audit logs list
 */
router.get('/', requirePermission('view_audit_logs'), ctrl.getAll);

module.exports = router;
