const router = require('express').Router();
const ctrl = require('../controllers/teachingProgram.controller');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permission');

/**
 * @swagger
 * tags:
 *   name: TeachingPrograms
 *   description: Teaching program management
 */

router.use(authenticate);

/**
 * @swagger
 * /api/teaching-programs:
 *   get:
 *     tags: [TeachingPrograms]
 *     summary: List all teaching programs
 *     responses:
 *       200:
 *         description: List of programs
 */
router.get('/', requirePermission('view_program'), ctrl.getAll);

/**
 * @swagger
 * /api/teaching-programs/{id}:
 *   get:
 *     tags: [TeachingPrograms]
 *     summary: Get program by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Program details
 */
router.get('/:id', requirePermission('view_program'), ctrl.getById);

/**
 * @swagger
 * /api/teaching-programs:
 *   post:
 *     tags: [TeachingPrograms]
 *     summary: Create a new program
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
 *         description: Program created
 */
router.post('/', requirePermission('create_program'), ctrl.create);

/**
 * @swagger
 * /api/teaching-programs/{id}:
 *   put:
 *     tags: [TeachingPrograms]
 *     summary: Update program
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Program updated
 */
router.put('/:id', requirePermission('edit_program'), ctrl.update);

/**
 * @swagger
 * /api/teaching-programs/{id}:
 *   delete:
 *     tags: [TeachingPrograms]
 *     summary: Delete program
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Program deleted
 */
router.delete('/:id', requirePermission('delete_program'), ctrl.delete);

module.exports = router;
