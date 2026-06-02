const Progress   = require('../models/Progress');
const Enrollment = require('../models/Enrollment');
const Lesson     = require('../models/Lesson');

// POST /api/progress/complete  — mark lesson as complete
const markComplete = async (req, res) => {
  try {
    const { lessonId, courseId } = req.body;
    if (!lessonId || !courseId)
      return res.status(400).json({ message: 'lessonId and courseId required.' });

    // Must be enrolled
    const enrolled = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course.' });

    // Upsert progress record
    await Progress.findOneAndUpdate(
      { student: req.user._id, lesson: lessonId },
      { student: req.user._id, lesson: lessonId, course: courseId },
      { upsert: true, new: true }
    );

    // Check if all lessons done → mark enrollment complete
    const [totalLessons, completedCount] = await Promise.all([
      Lesson.countDocuments({ course: courseId }),
      Progress.countDocuments({ student: req.user._id, course: courseId }),
    ]);

    if (totalLessons > 0 && completedCount >= totalLessons) {
      await Enrollment.findOneAndUpdate(
        { student: req.user._id, course: courseId },
        { isCompleted: true, completedAt: new Date() }
      );
    }

    res.json({ message: 'Lesson marked complete!', completedCount, totalLessons });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// GET /api/progress/course/:courseId  — get progress for a course
const getCourseProgress = async (req, res) => {
  try {
    const [completedLessons, totalLessons] = await Promise.all([
      Progress.find({ student: req.user._id, course: req.params.courseId })
        .select('lesson'),
      Lesson.countDocuments({ course: req.params.courseId }),
    ]);
    const percent = totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
    res.json({
      completedLessons: completedLessons.map(p => p.lesson.toString()),
      totalLessons,
      completedCount: completedLessons.length,
      percent,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { markComplete, getCourseProgress };
