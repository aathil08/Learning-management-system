const express = require('express');
const router  = express.Router();
const {
  getLessonsByCourse, getLessonById,
  createLesson, updateLesson, deleteLesson,
} = require('../controllers/lessonController');
const { protect, instructorOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const lessonUpload = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'file',  maxCount: 1 },
]);

router.get('/course/:courseId',  getLessonsByCourse);
router.get('/:id',               protect, getLessonById);
router.post('/',                 protect, instructorOnly, lessonUpload, createLesson);
router.put('/:id',               protect, instructorOnly, lessonUpload, updateLesson);
router.delete('/:id',            protect, instructorOnly, deleteLesson);

module.exports = router;
