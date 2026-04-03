const router = require('express').Router();
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/upload:
 *   post:
 *     tags: [Uploads]
 *     summary: Upload a file (image, pdf, doc) to Cloudinary
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
router.post('/', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }

  res.status(200).json({
    success: true,
    url: req.file.path,
    message: 'File uploaded successfully',
    filename: req.file.originalname
  });
});

module.exports = router;
