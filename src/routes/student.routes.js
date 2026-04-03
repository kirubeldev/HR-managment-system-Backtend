const router = require('express').Router();
const ctrl = require('../controllers/student.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permission');

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management
 */

router.use(authenticate);

/**
 * @swagger
 * /api/students:
 *   get:
 *     tags: [Students]
 *     summary: List all students
 *     responses:
 *       200:
 *         description: List of students
 */
router.get('/', requirePermission('view_student'), ctrl.getAll);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     tags: [Students]
 *     summary: Get student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Student details
 */
router.get('/:id', requirePermission('view_student'), ctrl.getById);

/**
 * @swagger
 * /api/students:
 *   post:
 *     tags: [Students]
 *     summary: Register a new student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, age, gender, educationLevel]
 *             properties:
 *               fullName: { type: string }
 *               age: { type: integer }
 *               gender: { type: string }
 *               educationLevel: { type: string }
 *               programIds: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Student created
 */
router.post('/', requirePermission('create_student'), ctrl.create);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     tags: [Students]
 *     summary: Update student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Student updated
 */
router.put('/:id', requirePermission('edit_student'), ctrl.update);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     tags: [Students]
 *     summary: Delete student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Student deleted
 */
router.delete('/:id', requirePermission('delete_student'), ctrl.delete);

module.exports = router;
