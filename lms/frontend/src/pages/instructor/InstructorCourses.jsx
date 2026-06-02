import { useState, useEffect } from 'react';
import { fetchMyCourses, createCourse, updateCourse, deleteCourse } from '../../api/services';
import CourseCard from '../../components/courses/CourseCard';
import CourseForm from '../../components/courses/CourseForm';
import Toast from '../../components/common/Toast';
import useToast from '../../hooks/useToast';
import Btn from '../../components/common/Btn';
import Icon from '../../components/common/Icon';

const InstructorCourses = () => {
  const { toast, showToast, hideToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editCourse, setEditCourse] = useState(null);

  useEffect(() => {
    fetchMyCourses()
      .then(res => setCourses(res.data.courses))
      .catch(() => showToast('Failed to load courses.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (fd) => {
    setFormLoading(true);
    try {
      const res = await createCourse(fd);
      setCourses(prev => [res.data.course, ...prev]);
      setShowCreate(false);
      showToast('Course created successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create.', 'error');
    } finally { setFormLoading(false); }
  };

  const handleUpdate = async (fd) => {
    setFormLoading(true);
    try {
      const res = await updateCourse(editCourse._id, fd);
      setCourses(prev => prev.map(c => c._id === editCourse._id ? res.data.course : c));
      setEditCourse(null);
      showToast('Course updated!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update.', 'error');
    } finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course and all its lessons?')) return;
    try {
      await deleteCourse(id);
      setCourses(prev => prev.filter(c => c._id !== id));
      showToast('Course deleted.', 'warning');
    } catch { showToast('Failed to delete.', 'error'); }
  };

  return (
    <div style={{ padding: '32px', animation: 'fadeIn .3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>My Courses</h1>
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>{courses.length} course{courses.length !== 1 ? 's' : ''} created</p>
        </div>
        <Btn onClick={() => setShowCreate(true)} icon={<Icon name="plus" size={16} color="#fff" />}>
          New Course
        </Btn>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 18 }} />)}
        </div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg2)', borderRadius: 18, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 56, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>📚</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--text)' }}>No courses yet</h3>
          <p style={{ color: 'var(--text3)', marginBottom: 20 }}>Create your first course to start teaching.</p>
          <Btn onClick={() => setShowCreate(true)} icon={<Icon name="plus" size={16} color="#fff" />}>Create First Course</Btn>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 22 }}>
          {courses.map(c => (
            <CourseCard key={c._id} course={c} isInstructor onEdit={setEditCourse} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showCreate && <CourseForm onClose={() => setShowCreate(false)} onSave={handleCreate} loading={formLoading} />}
      {editCourse && <CourseForm course={editCourse} onClose={() => setEditCourse(null)} onSave={handleUpdate} loading={formLoading} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default InstructorCourses;
