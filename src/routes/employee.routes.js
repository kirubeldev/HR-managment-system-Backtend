const router = require('express').Router();
const ctrl = require('../controllers/employee.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permission');

router.use(authenticate);
/**
 * @swagger
 * /api/employees:
 *   get:
 *     tags: [Employees]
 *     summary: List all employees (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: departmentId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Employees list
 */
router.get('/', requirePermission('view_employee'), ctrl.getAll);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     tags: [Employees]
 *     summary: Get employee by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Employee details
 */
router.get('/:id', requirePermission('view_employee'), ctrl.getById);

/**
 * @swagger
 * /api/employees:
 *   post:
 *     tags: [Employees]
 *     summary: Create new employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, departmentId]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               departmentId: { type: string }
 *               jobTitle: { type: string }
 *               hireDate: { type: string, format: date }
 *               salary: { type: number }
 *     responses:
 *       201:
 *         description: Employee created
 */
router.post('/', requirePermission('create_employee'), ctrl.create);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     tags: [Employees]
 *     summary: Update employee
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
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               departmentId: { type: string }
 *               jobTitle: { type: string }
 *               hireDate: { type: string, format: date }
 *               salary: { type: number }
 *     responses:
 *       200:
 *         description: Employee updated
 */
router.put('/:id', requirePermission('edit_employee'), ctrl.update);

/**
 * @swagger
 * /api/employees/{id}/status:
 *   patch:
 *     tags: [Employees]
 *     summary: Update employee status
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
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [active, inactive, terminated, leave] }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', requirePermission('edit_employee'), ctrl.updateStatus);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     tags: [Employees]
 *     summary: Delete employee
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Employee deleted
 */
router.delete('/:id', requirePermission('delete_employee'), ctrl.remove);

module.exports = router;
