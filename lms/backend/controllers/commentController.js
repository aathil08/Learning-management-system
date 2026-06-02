const Comment = require('../models/Comment');

// GET /api/comments/lesson/:lessonId
const getCommentsByLesson = async (req, res) => {
  try {
    const comments = await Comment.find({ lesson: req.params.lessonId })
      .populate('author', 'name avatar role')
      .sort({ createdAt: -1 });
    res.json({ comments });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/comments
const addComment = async (req, res) => {
  try {
    const { text, lessonId } = req.body;
    if (!text || !lessonId) return res.status(400).json({ message: 'text and lessonId required.' });
    const comment = await Comment.create({ text, lesson: lessonId, author: req.user._id });
    const populated = await comment.populate('author', 'name avatar role');
    res.status(201).json({ message: 'Comment added!', comment: populated });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });
    if (comment.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your comment.' });
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getCommentsByLesson, addComment, deleteComment };
