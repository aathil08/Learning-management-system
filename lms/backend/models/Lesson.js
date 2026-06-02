const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String, required: [true, 'Lesson title is required'], trim: true,
    },
    description: { type: String, default: '' },
    course: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true,
    },
    // videoType: 'upload' = file upload, 'youtube' = YouTube URL
    videoType: { type: String, enum: ['upload', 'youtube', ''], default: '' },
    videoUrl:  { type: String, default: '' },   // uploaded video path OR YouTube URL
    fileUrl:   { type: String, default: '' },   // uploaded attachment path
    fileName:  { type: String, default: '' },
    order:     { type: Number, default: 0 },
    duration:  { type: String, default: '' },   // e.g. "12:30"
    isFree:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);
