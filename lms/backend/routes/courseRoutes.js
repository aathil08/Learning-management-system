const express = require('express');
const router  = express.Router();
const {
  getAllCourses, getCourseById, getMyCourses,
  createCourse, updateCourse, deleteCourse,
} = require('../controllers/courseController');
const { protect, instructorOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/',                    getAllCourses);
router.get('/instructor/my',       protect, instructorOnly, getMyCourses);
router.get('/:id',                 getCourseById);
router.post('/',                   protect, instructorOnly, upload.single('thumbnail'), createCourse);
router.put('/:id',                 protect, instructorOnly, upload.single('thumbnail'), updateCourse);
router.delete('/:id',              protect, instructorOnly, deleteCourse);

module.exports = router;
