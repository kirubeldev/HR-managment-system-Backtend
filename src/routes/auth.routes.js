const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Returns JWT token
 */
router.post('/login', ctrl.login);

/**
 * @swagger
 * /api/auth/bootstrap-admin:
 *   post:
 *     tags: [Auth]
 *     summary: Create first Super Admin (no token required)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Super Admin created successfully
 *       403:
 *         description: Super Admin already exists
 */
router.post('/bootstrap-admin', ctrl.bootstrapAdmin);

/**
 * @swagger
 * /api/auth/set-password:
 *   post:
 *     tags: [Auth]
 *     summary: Set password using token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Password set successfully
 */
router.post('/set-password', ctrl.setPassword);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post('/refresh', ctrl.refresh);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.post('/forgot-password', ctrl.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password with OTP
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, password]
 *             properties:
 *               email: { type: string }
 *               otp: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post('/reset-password', ctrl.resetPassword);

/**
 * @swagger
 * /api/auth/activate:
 *   get:
 *     tags: [Auth]
 *     summary: Activate account using token
 *     security: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Account activated successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get('/activate', ctrl.activateAccount);

/**
 * @swagger
 * /api/auth/test-success:
 *   get:
 *     tags: [Auth]
 *     summary: Test endpoint to verify backend is working
 *     security: []
 *     responses:
 *       200:
 *         description: Backend test successful
 */
router.get('/test-success', ctrl.testSuccess);

/**
 * @swagger
 * /api/auth/seed-database:
 *   post:
 *     tags: [Auth]
 *     summary: Seed all database tables (development only)
 *     security: []
 *     responses:
 *       200:
 *         description: Database seeded successfully
 */
router.post('/seed-database', ctrl.seedDatabase);

module.exports = router;
