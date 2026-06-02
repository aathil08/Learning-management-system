const express = require('express');
const router  = express.Router();
const {
  enroll, getMyEnrollments, getCourseEnrollments, checkEnrollment,
} = require('../controllers/enrollmentController');
const { protect, studentOnly, instructorOnly } = require('../middleware/authMiddleware');

router.post('/',                        protect, studentOnly,    enroll);
router.get('/my',                       protect, studentOnly,    getMyEnrollments);
router.get('/course/:courseId',         protect, instructorOnly, getCourseEnrollments);
router.get('/check/:courseId',          protect,                 checkEnrollment);

module.exports = router;
