import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStudentDashboard } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import ProgressBar from '../../components/common/ProgressBar';
import Icon from '../../components/common/Icon';
import { truncate } from '../../utils/helpers';

const StudentDashboard = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDashboard()
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}><div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} /></div>;

  return (
    <div style={{ padding: '32px', animation: 'fadeIn .3s ease' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>
          Welcome back, {user?.name?.split(' ')[0]} 🎓
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 14 }}>Continue your learning journey from where you left off.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 36 }}>
        <StatCard label="Enrolled Courses" value={data?.totalEnrolled ?? 0}   icon="book"  color="#0ea5e9" />
        <StatCard label="Completed"         value={data?.totalCompleted ?? 0} icon="award" color="#10b981" />
        <StatCard label="In Progress"       value={(data?.totalEnrolled ?? 0) - (data?.totalCompleted ?? 0)} icon="trending" color="#f59e0b" />
      </div>

      {/* Continue learning */}
      <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>Continue Learning</h2>
      {!data?.enrollments?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg2)', borderRadius: 18, border: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ fontSize: 52, marginBottom: 14, animation: 'float 3s ease-in-out infinite' }}>📖</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: 'var(--text)' }}>No courses yet</h3>
          <p style={{ color: 'var(--text3)', marginBottom: 18 }}>Browse and enroll in courses to start learning.</p>
          <button onClick={() => navigate('/student/browse')} style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', border: 'none', color: '#fff', borderRadius: 11, padding: '11px 24px', fontSize: 13, fontWeight: 800 }}>Browse Courses</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18, marginBottom: 28 }}>
          {data.enrollments.slice(0, 6).map(e => {
            const prog = data.progressByCourse?.[e.course._id];
            return (
              <div key={e._id} onClick={() => navigate(`/student/courses/${e.course._id}`)}
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={el => { el.currentTarget.style.borderColor = 'var(--teal)'; el.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={el => { el.currentTarget.style.borderColor = 'var(--border)'; el.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 54, height: 54, borderRadius: 11, overflow: 'hidden', flexShrink: 0 }}>
                    {e.course.thumbnail ? <img src={e.course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="book" size={22} color="#fff" /></div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.course.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{e.course.instructor?.name}</div>
                  </div>
                </div>
                <ProgressBar percent={prog?.percent || 0} height={5} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12, color: 'var(--text3)' }}>
                  <span>{prog?.completed || 0}/{prog?.total || 0} lessons</span>
                  <span style={{ color: prog?.percent === 100 ? '#10b981' : 'var(--teal)', fontWeight: 700 }}>
                    {prog?.percent === 100 ? '✓ Complete' : `${prog?.percent || 0}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
