const Course     = require('../models/Course');
const Lesson     = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Progress   = require('../models/Progress');
const User       = require('../models/User');

// GET /api/dashboard/instructor
const instructorDashboard = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map(c => c._id);

    const [totalStudents, totalLessons, recentEnrollments] = await Promise.all([
      Enrollment.countDocuments({ course: { $in: courseIds } }),
      Lesson.countDocuments({ course: { $in: courseIds } }),
      Enrollment.find({ course: { $in: courseIds } })
        .populate('student', 'name avatar')
        .populate('course', 'title')
        .sort({ enrolledAt: -1 })
        .limit(5),
    ]);

    res.json({
      totalCourses: courses.length,
      totalStudents,
      totalLessons,
      recentEnrollments,
      courses: courses.slice(0, 5),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/dashboard/student
const studentDashboard = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({ path: 'course', populate: { path: 'instructor', select: 'name avatar' } });

    const courseIds = enrollments.map(e => e.course._id);

    const progressData = await Progress.find({
      student: req.user._id, course: { $in: courseIds },
    });

    // Build progress per course
    const progressByCourse = {};
    for (const enrollment of enrollments) {
      const cId = enrollment.course._id.toString();
      const total     = await Lesson.countDocuments({ course: cId });
      const completed = progressData.filter(p => p.course.toString() === cId).length;
      progressByCourse[cId] = { total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
    }

    res.json({
      totalEnrolled:   enrollments.length,
      totalCompleted:  enrollments.filter(e => e.isCompleted).length,
      enrollments,
      progressByCourse,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { instructorDashboard, studentDashboard };
