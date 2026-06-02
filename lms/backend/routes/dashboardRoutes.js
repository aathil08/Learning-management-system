const express = require('express');
const router  = express.Router();
const { instructorDashboard, studentDashboard } = require('../controllers/dashboardController');
const { protect, instructorOnly, studentOnly } = require('../middleware/authMiddleware');

router.get('/instructor', protect, instructorOnly, instructorDashboard);
router.get('/student',    protect, studentOnly,    studentDashboard);

module.exports = router;
