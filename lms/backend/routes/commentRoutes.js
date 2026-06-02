const express = require('express');
const router  = express.Router();
const { getCommentsByLesson, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/lesson/:lessonId',   getCommentsByLesson);
router.post('/',                  protect, addComment);
router.delete('/:id',             protect, deleteComment);

module.exports = router;
