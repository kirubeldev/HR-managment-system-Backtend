const express = require('express');
const router = express.Router();
const LeaveRequestController = require('../controllers/leaveRequest.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', LeaveRequestController.getAll);
router.post('/', LeaveRequestController.create);
router.get('/:id', LeaveRequestController.getById);
router.patch('/:id', LeaveRequestController.updateStatus);
router.delete('/:id', LeaveRequestController.delete);

module.exports = router;
