import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCourses } from '../../api/services';
import CourseCard from '../../components/courses/CourseCard';
import Toast from '../../components/common/Toast';
import useToast from '../../hooks/useToast';
import Icon from '../../components/common/Icon';
import { ALL_CATEGORIES, ALL_LEVELS } from '../../utils/helpers';

const BrowseCourses = () => {
  const { toast, showToast, hideToast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel]       = useState('All');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search)             params.search   = search;
      if (category !== 'All') params.category = category;
      if (level !== 'All')    params.level    = level;
      const res = await fetchCourses(params);
      setCourses(res.data.courses);
    } catch { showToast('Failed to load courses.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [category, level]);

  const handleSearch = e => { e.preventDefault(); load(); };

  return (
    <div style={{ padding: '32px', animation: 'fadeIn .3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>Browse Courses</h1>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>Discover {courses.length} courses — click any course to view details and enroll</p>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 220, display: 'flex', gap: 0 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px 0 0 10px', padding: '0 14px', height: 42 }}>
            <Icon name="search" size={16} color="var(--text3)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: 13, flex: 1, outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <button type="submit" style={{ background: 'var(--teal)', border: 'none', color: '#fff', borderRadius: '0 10px 10px 0', padding: '0 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Search</button>
        </form>

        <select value={category} onChange={e => setCategory(e.target.value)}
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '0 14px', color: 'var(--text)', fontSize: 13, height: 42, fontFamily: 'inherit', outline: 'none' }}>
          {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <select value={level} onChange={e => setLevel(e.target.value)}
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '0 14px', color: 'var(--text)', fontSize: 13, height: 42, fontFamily: 'inherit', outline: 'none' }}>
          {ALL_LEVELS.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {ALL_CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{ background: category === c ? 'linear-gradient(135deg,#0ea5e9,#6366f1)' : 'var(--bg2)', border: `1px solid ${category === c ? 'transparent' : 'var(--border)'}`, color: category === c ? '#fff' : 'var(--text2)', borderRadius: 99, padding: '5px 16px', fontSize: 12, fontWeight: 700, transition: 'all .2s', cursor: 'pointer' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 18 }} />)}
        </div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '70px 20px', background: 'var(--bg2)', borderRadius: 18, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🔍</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>No courses found</h3>
          <p style={{ color: 'var(--text3)' }}>Try a different search or category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 22 }}>
          {courses.map(c => (
            <CourseCard
              key={c._id}
              course={c}
              isEnrolled={false}
              isInstructor={false}
            />
          ))}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default BrowseCourses;
