const Course     = require('../models/Course');
const Lesson     = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

// GET /api/courses  — public, with search & filter
const getAllCourses = async (req, res) => {
  try {
    const { search, category, level, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };
    if (search)   query.title    = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (level)    query.level    = level;
    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      Course.find(query).populate('instructor', 'name avatar')
        .populate('lessonCount').populate('enrollmentCount')
        .skip(skip).limit(+limit).sort({ createdAt: -1 }),
      Course.countDocuments(query),
    ]);
    res.json({ courses, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio');
    if (!course) return res.status(404).json({ message: 'Course not found.' });
    const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 });
    res.json({ course, lessons });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/courses/instructor/my  — instructor's own courses
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('lessonCount').populate('enrollmentCount')
      .sort({ createdAt: -1 });
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/courses  — instructor only
const createCourse = async (req, res) => {
  try {
    const { title, description, category, level, price } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: 'Title and description are required.' });
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : req.body.thumbnail || '';
    const course = await Course.create({
      title, description, category, level, price: price || 0,
      thumbnail, instructor: req.user._id,
    });
    res.status(201).json({ message: 'Course created!', course });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// PUT /api/courses/:id  — instructor only
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found.' });
    if (course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your course.' });
    const fields = ['title', 'description', 'category', 'level', 'price', 'isPublished'];
    fields.forEach(f => { if (req.body[f] !== undefined) course[f] = req.body[f]; });
    if (req.file) course.thumbnail = `/uploads/${req.file.filename}`;
    const updated = await course.save();
    res.json({ message: 'Course updated!', course: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/courses/:id  — instructor only
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found.' });
    if (course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your course.' });
    await Promise.all([
      Course.findByIdAndDelete(req.params.id),
      Lesson.deleteMany({ course: req.params.id }),
      Enrollment.deleteMany({ course: req.params.id }),
    ]);
    res.json({ message: 'Course deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAllCourses, getCourseById, getMyCourses, createCourse, updateCourse, deleteCourse };
