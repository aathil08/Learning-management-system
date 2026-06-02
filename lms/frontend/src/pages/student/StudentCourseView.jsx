import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchCourseById, fetchLessonsByCourse,
  fetchCourseProgress, checkEnrollment, enrollCourse,
} from '../../api/services';
import LessonItem from '../../components/lessons/LessonItem';
import LessonPage from './LessonPage';
import ProgressBar from '../../components/common/ProgressBar';
import Toast from '../../components/common/Toast';
import useToast from '../../hooks/useToast';
import Icon from '../../components/common/Icon';
import { categoryColor } from '../../utils/helpers';

const StudentCourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [course,        setCourse]        = useState(null);
  const [lessons,       setLessons]       = useState([]);
  const [progress,      setProgress]      = useState(null);
  const [isEnrolled,    setIsEnrolled]    = useState(false);
  const [activeLesson,  setActiveLesson]  = useState(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [cRes, lRes, eRes] = await Promise.all([
          fetchCourseById(id),
          fetchLessonsByCourse(id),
          checkEnrollment(id),
        ]);
        setCourse(cRes.data.course);
        setLessons(lRes.data.lessons);
        setIsEnrolled(eRes.data.isEnrolled);
        if (eRes.data.isEnrolled) {
          const pRes = await fetchCourseProgress(id);
          setProgress(pRes.data);
        }
      } catch { showToast('Failed to load course.', 'error'); }
      finally { setLoading(false); }
    };
    init();
  }, [id]);

  const handleEnroll = async () => {
    setEnrollLoading(true);
    try {
      await enrollCourse({ courseId: id });
      setIsEnrolled(true);
      const pRes = await fetchCourseProgress(id);
      setProgress(pRes.data);
      showToast('🎉 Enrolled! You can now access all lessons.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to enroll.', 'error');
    } finally { setEnrollLoading(false); }
  };

  const handleLessonComplete = async () => {
    const pRes = await fetchCourseProgress(id);
    setProgress(pRes.data);
  };

  const handleLessonClick = (lesson) => {
    if (isEnrolled || lesson.isFree) setActiveLesson(lesson);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
    </div>
  );

  if (activeLesson) {
    return (
      <LessonPage
        lesson={activeLesson}
        courseId={id}
        completedIds={progress?.completedLessons || []}
        onBack={() => setActiveLesson(null)}
        onComplete={handleLessonComplete}
        lessons={lessons.filter(l => isEnrolled || l.isFree)}
        onSelectLesson={setActiveLesson}
      />
    );
  }

  const catColor  = categoryColor[course?.category] || '#64748b';
  const freeCount = lessons.filter(l => l.isFree).length;

  return (
    <div style={{ padding: '32px', animation: 'fadeIn .3s ease', maxWidth: 900 }}>
      {/* Back button */}
      <button onClick={() => navigate('/student/browse')}
        style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, marginBottom: 22 }}>
        <Icon name="arrowLeft" size={16} /> Back to Browse
      </button>

      {/* ── Course Hero Card ── */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 22, overflow: 'hidden', marginBottom: 28 }}>
        {/* Thumbnail */}
        <div style={{ height: 260, position: 'relative', overflow: 'hidden' }}>
          {course?.thumbnail
            ? <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (
              <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg,${catColor}44,${catColor}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="book" size={80} color={catColor} />
              </div>
            )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(17,24,39,0.97) 0%,rgba(17,24,39,0.3) 60%,transparent 100%)' }} />

          {/* Badges on image */}
          <div style={{ position: 'absolute', top: 16, left: 20, display: 'flex', gap: 8 }}>
            <span style={{ background: catColor, color: '#fff', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 800 }}>{course?.category}</span>
            <span style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', color: '#fff', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>{course?.level}</span>
          </div>

          {/* Title + meta overlay */}
          <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 10, lineHeight: 1.2 }}>{course?.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              {/* Instructor */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.4)' }}>
                  {course?.instructor?.avatar
                    ? <img src={course.instructor.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Icon name="user" size={15} color="#fff" />}
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{course?.instructor?.name || 'Instructor'}</span>
              </div>
              {/* Stats */}
              {[
                ['book',  `${lessons.length} Lessons`],
                ['users', `${course?.enrollmentCount || 0} Students`],
              ].map(([icon, txt]) => (
                <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  <Icon name={icon} size={13} color="rgba(255,255,255,0.7)" />{txt}
                </div>
              ))}
              {freeCount > 0 && (
                <span style={{ background: 'rgba(16,185,129,0.25)', color: '#10b981', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 800 }}>
                  {freeCount} Free Preview{freeCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '24px 28px' }}>
          {/* Description */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>About this Course</h2>
            <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.8 }}>{course?.description || 'No description available.'}</p>
          </div>

          {/* Progress if enrolled */}
          {isEnrolled && progress && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Your Progress</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--teal2)' }}>{progress.percent}%</span>
              </div>
              <ProgressBar percent={progress.percent} />
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>
                {progress.completedCount} of {progress.totalLessons} lessons completed
              </div>
            </div>
          )}

          {/* CTA */}
          {isEnrolled ? (
            <button
              onClick={() => {
                const first = lessons[0];
                if (first) setActiveLesson(first);
              }}
              style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', border: 'none', color: '#fff', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="play" size={17} color="#fff" />
              {progress?.percent > 0 ? 'Continue Learning' : 'Start Learning'}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <button onClick={handleEnroll} disabled={enrollLoading}
                style={{ background: enrollLoading ? 'var(--bg3)' : 'linear-gradient(135deg,#f59e0b,#ef4444)', border: 'none', color: '#fff', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 800, cursor: enrollLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                {enrollLoading
                  ? <><span style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} /> Enrolling...</>
                  : <><Icon name="book" size={17} color="#fff" /> Enroll Now — Free</>}
              </button>
              {freeCount > 0 && (
                <p style={{ fontSize: 13, color: 'var(--text3)' }}>
                  <Icon name="eye" size={13} color="var(--teal)" style={{ display: 'inline', marginRight: 4 }} />
                  {freeCount} free preview lesson{freeCount > 1 ? 's' : ''} available without enrolling
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Course Content ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
            Course Content
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)', marginLeft: 10 }}>({lessons.length} lessons)</span>
          </h2>
          {!isEnrolled && (
            <span style={{ fontSize: 12, color: 'var(--text3)', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 12px' }}>
              🔒 Enroll to unlock all lessons
            </span>
          )}
        </div>

        {lessons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, background: 'var(--bg2)', borderRadius: 14, border: '1px solid var(--border)', color: 'var(--text3)' }}>
            No lessons added yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lessons.map((l, i) => (
              <LessonItem
                key={l._id}
                lesson={l}
                index={i}
                isCompleted={progress?.completedLessons?.includes(l._id)}
                isEnrolled={isEnrolled}
                isInstructor={false}
                onView={(isEnrolled || l.isFree) ? handleLessonClick : null}
              />
            ))}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default StudentCourseView;
