import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourseById, fetchLessonsByCourse, createLesson, updateLesson, deleteLesson, fetchCourseEnrollments } from '../../api/services';
import LessonItem from '../../components/lessons/LessonItem';
import LessonForm from '../../components/lessons/LessonForm';
import Toast from '../../components/common/Toast';
import useToast from '../../hooks/useToast';
import Btn from '../../components/common/Btn';
import Icon from '../../components/common/Icon';
import { formatDate, categoryColor, levelColor } from '../../utils/helpers';

const InstructorCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [course, setCourse]       = useState(null);
  const [lessons, setLessons]     = useState([]);
  const [students, setStudents]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showAdd, setShowAdd]     = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [tab, setTab]             = useState('lessons');

  useEffect(() => {
    Promise.all([fetchCourseById(id), fetchLessonsByCourse(id), fetchCourseEnrollments(id)])
      .then(([cRes, lRes, sRes]) => {
        setCourse(cRes.data.course);
        setLessons(lRes.data.lessons);
        setStudents(sRes.data.enrollments);
      })
      .catch(() => showToast('Failed to load.', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddLesson = async (fd) => {
    setFormLoading(true);
    try {
      const res = await createLesson(fd);
      setLessons(prev => [...prev, res.data.lesson].sort((a, b) => a.order - b.order));
      setShowAdd(false);
      showToast('Lesson added!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed.', 'error');
    } finally { setFormLoading(false); }
  };

  const handleUpdateLesson = async (fd) => {
    setFormLoading(true);
    try {
      const res = await updateLesson(editLesson._id, fd);
      setLessons(prev => prev.map(l => l._id === editLesson._id ? res.data.lesson : l));
      setEditLesson(null);
      showToast('Lesson updated!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed.', 'error');
    } finally { setFormLoading(false); }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await deleteLesson(lessonId);
      setLessons(prev => prev.filter(l => l._id !== lessonId));
      showToast('Lesson deleted.', 'warning');
    } catch { showToast('Failed.', 'error'); }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}><div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} /></div>;

  const catColor = categoryColor[course?.category] || '#64748b';

  return (
    <div style={{ padding: '32px', animation: 'fadeIn .3s ease' }}>
      {/* Back */}
      <button onClick={() => navigate('/instructor/courses')} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
        <Icon name="arrowLeft" size={16} /> Back to Courses
      </button>

      {/* Course header */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, marginBottom: 28, display: 'flex', gap: 24 }}>
        <div style={{ width: 140, height: 100, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
          {course?.thumbnail
            ? <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg,${catColor},${catColor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="book" size={32} color="#fff" /></div>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span style={{ background: catColor, color: '#fff', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 800 }}>{course?.category}</span>
            <span style={{ background: 'var(--bg3)', color: 'var(--text2)', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{course?.level}</span>
            <span style={{ background: course?.isPublished ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)', color: course?.isPublished ? '#10b981' : 'var(--text3)', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 800 }}>
              {course?.isPublished ? '🟢 Published' : '⚪ Draft'}
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 6, fontFamily: "'Fraunces', serif" }}>{course?.title}</h1>
          <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>{course?.description}</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['book', `${lessons.length} lessons`], ['users', `${students.length} students`], ['clock', `Created ${formatDate(course?.createdAt)}`]].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text3)' }}>
                <Icon name={icon} size={13} color="var(--text3)" />{text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {['lessons','students'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: 9, border: 'none', background: tab === t ? 'var(--teal)' : 'transparent', color: tab === t ? '#fff' : 'var(--text2)', fontWeight: 700, fontSize: 13, textTransform: 'capitalize' }}>
            {t} {t === 'lessons' ? `(${lessons.length})` : `(${students.length})`}
          </button>
        ))}
      </div>

      {tab === 'lessons' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Lessons</h2>
            <Btn onClick={() => setShowAdd(true)} size="sm" icon={<Icon name="plus" size={14} color="#fff" />}>Add Lesson</Btn>
          </div>
          {lessons.length === 0
            ? <div style={{ textAlign: 'center', padding: 40, background: 'var(--bg2)', borderRadius: 14, border: '1px solid var(--border)', color: 'var(--text3)' }}>No lessons yet. Add your first lesson.</div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {lessons.map((l, i) => <LessonItem key={l._id} lesson={l} index={i} isInstructor onEdit={setEditLesson} onDelete={handleDeleteLesson} />)}
              </div>}
        </>
      )}

      {tab === 'students' && (
        <>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>Enrolled Students ({students.length})</h2>
          {students.length === 0
            ? <div style={{ textAlign: 'center', padding: 40, background: 'var(--bg2)', borderRadius: 14, border: '1px solid var(--border)', color: 'var(--text3)' }}>No students enrolled yet.</div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {students.map(e => (
                  <div key={e._id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {e.student?.avatar ? <img src={e.student.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icon name="user" size={18} color="#fff" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{e.student?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)' }}>{e.student?.email}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>Enrolled {formatDate(e.enrolledAt)}</div>
                    {e.isCompleted && <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 800 }}>✓ Completed</span>}
                  </div>
                ))}
              </div>}
        </>
      )}

      {showAdd && <LessonForm courseId={id} onClose={() => setShowAdd(false)} onSave={handleAddLesson} loading={formLoading} />}
      {editLesson && <LessonForm courseId={id} lesson={editLesson} onClose={() => setEditLesson(null)} onSave={handleUpdateLesson} loading={formLoading} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default InstructorCourseDetail;
