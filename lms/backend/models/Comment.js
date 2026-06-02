const mongoose = require('mongoose');

// One lesson → many comments (stores lesson_id — the "many" side holds the FK)
const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String, required: [true, 'Comment text is required'], trim: true,
    },
    // FK to lesson
    lesson: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
