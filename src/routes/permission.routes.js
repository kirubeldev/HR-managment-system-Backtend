const router = require('express').Router();
const ctrl = require('../controllers/permission.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permission');

router.use(authenticate);
/**
 * @swagger
 * /api/permissions:
 *   get:
 *     tags: [Permissions]
 *     summary: List all permissions
 *     responses:
 *       200:
 *         description: Permissions list
 */
router.get('/', ctrl.getAll);

/**
 * @swagger
 * /api/permissions/assign-to-role:
 *   patch:
 *     tags: [Permissions]
 *     summary: Assign permissions to a role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roleId, permissionIds]
 *             properties:
 *               roleId: { type: string }
 *               permissionIds: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Permissions assigned
 */
router.patch('/assign-to-role', requirePermission('manage_permissions'), ctrl.assignToRole);

module.exports = router;
