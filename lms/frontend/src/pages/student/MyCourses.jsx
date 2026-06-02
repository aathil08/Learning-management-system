import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyEnrollments } from '../../api/services';
import CourseCard from '../../components/courses/CourseCard';
import Icon from '../../components/common/Icon';

const MyCourses = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    fetchMyEnrollments()
      .then(res => setEnrollments(res.data.enrollments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active    = enrollments.filter(e => !e.isCompleted);
  const completed = enrollments.filter(e => e.isCompleted);

  return (
    <div style={{ padding: '32px', animation: 'fadeIn .3s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>My Learning</h1>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>{enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled</p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 18 }} />)}
        </div>
      ) : enrollments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg2)', borderRadius: 18, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 56, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>📚</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>No courses yet</h3>
          <p style={{ color: 'var(--text3)', marginBottom: 20 }}>Enroll in a course to start learning.</p>
          <button onClick={() => navigate('/student/browse')} style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', border: 'none', color: '#fff', borderRadius: 11, padding: '11px 24px', fontSize: 13, fontWeight: 800 }}>Browse Courses</button>
        </div>
      ) : (
        <>
          {/* In progress */}
          {active.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="trending" size={18} color="var(--teal)" /> In Progress ({active.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
                {active.map(e => (
                  <CourseCard key={e._id} course={e.course} isEnrolled={true} isInstructor={false} />
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="award" size={18} color="#10b981" /> Completed ({completed.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
                {completed.map(e => (
                  <CourseCard key={e._id} course={e.course} isEnrolled={true} isInstructor={false} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyCourses;
