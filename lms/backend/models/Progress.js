const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true,
    },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// A student can only mark a lesson complete once
progressSchema.index({ student: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
