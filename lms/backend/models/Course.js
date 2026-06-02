const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String, required: [true, 'Course title is required'], trim: true,
    },
    description: { type: String, required: [true, 'Description is required'] },
    thumbnail:   { type: String, default: '' },
    category: {
      type: String,
      enum: ['Web Development', 'Mobile', 'Data Science', 'Design', 'DevOps', 'Other'],
      default: 'Other',
    },
    level: {
      type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner',
    },
    // One instructor → many courses (stores instructor_id)
    instructor: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
    },
    isPublished: { type: Boolean, default: false },
    price:       { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual: count of lessons in this course
courseSchema.virtual('lessonCount', {
  ref: 'Lesson', localField: '_id', foreignField: 'course', count: true,
});

// Virtual: count of enrollments
courseSchema.virtual('enrollmentCount', {
  ref: 'Enrollment', localField: '_id', foreignField: 'course', count: true,
});

module.exports = mongoose.model('Course', courseSchema);
