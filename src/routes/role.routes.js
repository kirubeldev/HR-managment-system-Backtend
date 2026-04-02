const router = require('express').Router();
const ctrl = require('../controllers/role.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permission');

router.use(authenticate);
/**
 * @swagger
 * /api/roles:
 *   get:
 *     tags: [Roles]
 *     summary: List all roles
 *     responses:
 *       200:
 *         description: Roles list
 */
router.get('/', ctrl.getAll);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     tags: [Roles]
 *     summary: Create new role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: Role created
 */
router.post('/', requirePermission('manage_roles'), ctrl.create);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     tags: [Roles]
 *     summary: Update role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *     responses:
 *       200:
 *         description: Role updated
 */
router.put('/:id', requirePermission('manage_roles'), ctrl.update);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     tags: [Roles]
 *     summary: Delete role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Role deleted
 */
router.delete('/:id', requirePermission('manage_roles'), ctrl.remove);

module.exports = router;
