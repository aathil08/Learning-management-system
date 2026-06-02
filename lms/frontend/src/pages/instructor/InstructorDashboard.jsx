import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchInstructorDashboard } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import Icon from '../../components/common/Icon';
import { formatDate } from '../../utils/helpers';

const InstructorDashboard = () => {
  const { user }          = useAuth();
  const navigate          = useNavigate();
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorDashboard()
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ padding: '32px', animation: 'fadeIn .3s ease' }}>
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>
          Good day, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 14 }}>Here's what's happening with your courses today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 36 }}>
        <StatCard label="Total Courses"  value={data?.totalCourses  ?? 0} icon="book"    color="#0ea5e9" />
        <StatCard label="Total Students" value={data?.totalStudents ?? 0} icon="users"   color="#8b5cf6" />
        <StatCard label="Total Lessons"  value={data?.totalLessons  ?? 0} icon="play"    color="#f59e0b" />
        <StatCard label="Enrollments"    value={data?.recentEnrollments?.length ?? 0} icon="trending" color="#10b981" sub="recent activity" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* My courses */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>My Courses</h2>
            <button onClick={() => navigate('/instructor/courses')} style={{ background: 'rgba(14,165,233,0.12)', border: 'none', color: 'var(--teal2)', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700 }}>View All →</button>
          </div>
          {data?.courses?.length === 0
            ? <p style={{ color: 'var(--text3)', fontSize: 13 }}>No courses yet. Create your first course!</p>
            : data?.courses?.map(c => (
              <div key={c._id} onClick={() => navigate(`/instructor/courses/${c._id}`)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ width: 40, height: 40, borderRadius: 9, background: 'var(--bg3)', overflow: 'hidden', flexShrink: 0 }}>
                  {c.thumbnail ? <img src={c.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="book" size={16} color="#fff" /></div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{c.isPublished ? '🟢 Published' : '⚪ Draft'}</div>
                </div>
              </div>
            ))}
        </div>

        {/* Recent enrollments */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 18 }}>Recent Enrollments</h2>
          {data?.recentEnrollments?.length === 0
            ? <p style={{ color: 'var(--text3)', fontSize: 13 }}>No enrollments yet.</p>
            : data?.recentEnrollments?.map(e => (
              <div key={e._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                  {e.student?.avatar ? <img src={e.student.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icon name="user" size={15} color="#fff" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{e.student?.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.course?.title}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', flexShrink: 0 }}>{formatDate(e.enrolledAt)}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
