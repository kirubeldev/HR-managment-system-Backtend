const router = require('express').Router();
const ctrl = require('../controllers/department.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permission');

router.use(authenticate);
/**
 * @swagger
 * /api/departments:
 *   get:
 *     tags: [Departments]
 *     summary: List all departments
 *     responses:
 *       200:
 *         description: Departments list
 */
router.get('/', requirePermission('view_departments'), ctrl.getAll);

/**
 * @swagger
 * /api/departments:
 *   post:
 *     tags: [Departments]
 *     summary: Create new department
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Department created
 */
router.post('/', requirePermission('create_department'), ctrl.create);

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     tags: [Departments]
 *     summary: Update department
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
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Department updated
 */
router.put('/:id', requirePermission('edit_department'), ctrl.update);

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     tags: [Departments]
 *     summary: Delete department
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Department deleted
 */
router.delete('/:id', requirePermission('delete_department'), ctrl.remove);

module.exports = router;
