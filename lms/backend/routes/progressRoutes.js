const express = require('express');
const router  = express.Router();
const { markComplete, getCourseProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.post('/complete',           protect, markComplete);
router.get('/course/:courseId',    protect, getCourseProgress);

module.exports = router;
