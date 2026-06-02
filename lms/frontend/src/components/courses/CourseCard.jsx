import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';
import ProgressBar from '../common/ProgressBar';
import { categoryColor, truncate } from '../../utils/helpers';

const CourseCard = ({ course, progress, isEnrolled, isInstructor, onEdit, onDelete }) => {
  const [hov, setHov] = useState(false);
  const navigate      = useNavigate();
  const cat           = categoryColor[course.category] || '#64748b';

  // Always navigate to course detail — enrollment happens on that page
  const handleClick = () => {
    if (isInstructor) navigate(`/instructor/courses/${course._id}`);
    else navigate(`/student/courses/${course._id}`);
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--bg2)',
        border: `1px solid ${hov ? cat + '55' : 'var(--border)'}`,
        borderRadius: 18, overflow: 'hidden',
        transform: hov ? 'translateY(-5px)' : 'none',
        transition: 'all .3s cubic-bezier(.23,1,.32,1)',
        boxShadow: hov ? `0 16px 48px ${cat}18` : 'none',
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: 170, overflow: 'hidden', cursor: 'pointer' }} onClick={handleClick}>
        <img
          src={course.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80`}
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform .5s ease' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg2) 0%, transparent 60%)' }} />
        <span style={{ position: 'absolute', top: 10, left: 10, background: cat, color: '#fff', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 800 }}>
          {course.category}
        </span>
        <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
          {course.level}
        </span>
        {progress?.percent === 100 && (
          <div style={{ position: 'absolute', bottom: 10, right: 10, background: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="award" size={12} color="#fff" /> Completed
          </div>
        )}
      </div>

      <div style={{ padding: '16px 18px 18px' }}>
        <h3 onClick={handleClick} style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6, lineHeight: 1.35, cursor: 'pointer' }}>
          {course.title}
        </h3>
        <p style={{ color: 'var(--text3)', fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
          {truncate(course.description, 70)}
        </p>

        {/* Instructor */}
        {course.instructor && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg3)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {course.instructor.avatar
                ? <img src={course.instructor.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <Icon name="user" size={13} color="var(--text3)" />}
            </div>
            <span style={{ fontSize: 12, color: 'var(--text2)' }}>{course.instructor.name}</span>
          </div>
        )}

        {/* Meta */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
          {[
            ['book',  `${course.lessonCount || 0} lessons`],
            ['users', `${course.enrollmentCount || 0} enrolled`],
          ].map(([icon, text]) => (
            <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text3)' }}>
              <Icon name={icon} size={13} color="var(--text3)" />{text}
            </div>
          ))}
        </div>

        {/* Progress bar for enrolled */}
        {progress && (
          <div style={{ marginBottom: 14 }}>
            <ProgressBar percent={progress.percent} showLabel={true} />
          </div>
        )}

        {/* Action buttons */}
        {isInstructor ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => navigate(`/instructor/courses/${course._id}`)} style={{ flex: 1, background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.25)', color: 'var(--teal2)', borderRadius: 9, padding: '8px 0', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer' }}>
              <Icon name="eye" size={13} /> Manage
            </button>
            <button onClick={() => onEdit && onEdit(course)} style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 9, padding: '8px 0', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer' }}>
              <Icon name="edit" size={13} /> Edit
            </button>
          </div>
        ) : isEnrolled ? (
          <button onClick={handleClick} style={{ width: '100%', background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', border: 'none', color: '#fff', borderRadius: 9, padding: '10px 0', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer' }}>
            <Icon name="play" size={14} color="#fff" />
            {progress?.percent > 0 ? 'Continue Learning' : 'Start Learning'}
          </button>
        ) : (
          <button onClick={handleClick} style={{ width: '100%', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', border: 'none', color: '#fff', borderRadius: 9, padding: '10px 0', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer' }}>
            <Icon name="book" size={14} color="#fff" /> View Course
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
