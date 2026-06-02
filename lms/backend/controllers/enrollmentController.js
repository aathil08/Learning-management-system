const Enrollment = require('../models/Enrollment');
const Course     = require('../models/Course');

// POST /api/enrollments  — student enrolls in course
const enroll = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: 'courseId required.' });
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found.' });
    const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (existing) return res.status(400).json({ message: 'Already enrolled.' });
    const enrollment = await Enrollment.create({ student: req.user._id, course: courseId });
    res.status(201).json({ message: 'Enrolled successfully!', enrollment });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// GET /api/enrollments/my  — student's enrolled courses
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({ path: 'course', populate: { path: 'instructor', select: 'name avatar' } })
      .sort({ enrolledAt: -1 });
    res.json({ enrollments });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/enrollments/course/:courseId  — instructor sees who enrolled
const getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email avatar')
      .sort({ enrolledAt: -1 });
    res.json({ enrollments });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/enrollments/check/:courseId  — check if student enrolled
const checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id, course: req.params.courseId,
    });
    res.json({ isEnrolled: !!enrollment, enrollment });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { enroll, getMyEnrollments, getCourseEnrollments, checkEnrollment };
