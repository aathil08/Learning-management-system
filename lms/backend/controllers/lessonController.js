const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// Helper: convert YouTube watch URL to embed URL
const toYouTubeEmbed = (url) => {
  if (!url) return '';
  // Already embed format
  if (url.includes('/embed/')) return url;
  // youtu.be short link
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // youtube.com/watch?v=
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  return url;
};

// GET /api/lessons/course/:courseId
const getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });
    res.json({ lessons });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/lessons/:id
const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course', 'title instructor');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found.' });
    res.json({ lesson });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/lessons  — instructor/admin only
const createLesson = async (req, res) => {
  try {
    const { title, description, courseId, order, duration, isFree, videoType, youtubeUrl } = req.body;
    if (!title || !courseId) return res.status(400).json({ message: 'Title and courseId required.' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found.' });
    if (course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your course.' });

    let finalVideoUrl = '';
    let finalVideoType = videoType || '';
    let fileUrl = '', fileName = '';

    if (req.files) {
      if (req.files.video && videoType === 'upload') {
        finalVideoUrl  = `/uploads/${req.files.video[0].filename}`;
        finalVideoType = 'upload';
      }
      if (req.files.file) {
        fileUrl  = `/uploads/${req.files.file[0].filename}`;
        fileName = req.files.file[0].originalname;
      }
    }

    // YouTube URL takes priority if videoType is youtube
    if (videoType === 'youtube' && youtubeUrl) {
      finalVideoUrl  = toYouTubeEmbed(youtubeUrl);
      finalVideoType = 'youtube';
    }

    const lesson = await Lesson.create({
      title, description, course: courseId,
      videoType: finalVideoType,
      videoUrl: finalVideoUrl,
      fileUrl, fileName,
      order: order || 0, duration: duration || '',
      isFree: isFree === 'true' || isFree === true,
    });
    res.status(201).json({ message: 'Lesson created!', lesson });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// PUT /api/lessons/:id
const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found.' });
    if (lesson.course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized.' });

    const fields = ['title', 'description', 'order', 'duration', 'isFree'];
    fields.forEach(f => { if (req.body[f] !== undefined) lesson[f] = req.body[f]; });

    const { videoType, youtubeUrl } = req.body;

    if (videoType === 'youtube' && youtubeUrl) {
      lesson.videoUrl  = toYouTubeEmbed(youtubeUrl);
      lesson.videoType = 'youtube';
    } else if (videoType === 'upload') {
      lesson.videoType = 'upload';
      if (req.files?.video) lesson.videoUrl = `/uploads/${req.files.video[0].filename}`;
    }

    if (req.files?.file) {
      lesson.fileUrl  = `/uploads/${req.files.file[0].filename}`;
      lesson.fileName = req.files.file[0].originalname;
    }

    const updated = await lesson.save();
    res.json({ message: 'Lesson updated!', lesson: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/lessons/:id
const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found.' });
    if (lesson.course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized.' });
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lesson deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getLessonsByCourse, getLessonById, createLesson, updateLesson, deleteLesson };
