const mongoose = require('mongoose');

// One course → many enrollments (stores course_id + student_id)
// This is how many-to-many (Student ↔ Course) is handled using 1:N internally
const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true,
    },
    enrolledAt:   { type: Date, default: Date.now },
    completedAt:  { type: Date, default: null },
    isCompleted:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

// A student can only enroll once per course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
