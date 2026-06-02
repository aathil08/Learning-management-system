import Icon from '../common/Icon';

const LessonItem = ({ lesson, index, isCompleted, isEnrolled, isInstructor, onView, onEdit, onDelete }) => {
  // A lesson is accessible if: enrolled, free preview, or instructor view
  const isAccessible = isInstructor || isEnrolled || lesson.isFree;
  const isLocked     = !isAccessible;

  return (
    <div
      style={{
        background: 'var(--bg3)',
        border: `1px solid ${isLocked ? 'var(--border)' : 'var(--border)'}`,
        borderRadius: 12, padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        transition: 'border-color .2s, background .2s',
        opacity: isLocked ? 0.7 : 1,
      }}
      onMouseEnter={e => !isLocked && (e.currentTarget.style.borderColor = 'var(--teal)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Number / check / lock */}
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: isCompleted ? '#10b98120' : isLocked ? 'var(--bg2)' : 'var(--bg2)',
        border: `2px solid ${isCompleted ? '#10b981' : isLocked ? 'var(--border2)' : 'var(--border2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 800, color: isCompleted ? '#10b981' : 'var(--text3)',
      }}>
        {isCompleted
          ? <Icon name="check" size={16} color="#10b981" />
          : isLocked
            ? <Icon name="lock" size={15} color="var(--text3)" />
            : index + 1}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: isLocked ? 'var(--text3)' : 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
          {lesson.title}
          {lesson.isFree && (
            <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '1px 8px', borderRadius: 99, fontSize: 10, fontWeight: 800 }}>
              FREE PREVIEW
            </span>
          )}
          {isLocked && (
            <span style={{ background: 'rgba(100,116,139,0.15)', color: 'var(--text3)', padding: '1px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700 }}>
              LOCKED
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
          {lesson.duration && (
            <span style={{ fontSize: 12, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="clock" size={12} color="var(--text3)" />{lesson.duration}
            </span>
          )}
          {lesson.videoUrl && (
            <span style={{ fontSize: 12, color: isLocked ? 'var(--text3)' : 'var(--teal)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="video" size={12} color={isLocked ? 'var(--text3)' : 'var(--teal)'} />
              {lesson.videoType === 'youtube' ? 'YouTube' : 'Video'}
            </span>
          )}
          {lesson.fileUrl && (
            <span style={{ fontSize: 12, color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="file" size={12} color="var(--amber)" />File
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {isAccessible && onView && (
          <button onClick={() => onView(lesson)} style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.25)', color: 'var(--teal2)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
            <Icon name="play" size={12} color="var(--teal2)" /> Play
          </button>
        )}
        {isInstructor && onEdit && (
          <button onClick={() => onEdit(lesson)} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <Icon name="edit" size={12} />
          </button>
        )}
        {isInstructor && onDelete && (
          <button onClick={() => onDelete(lesson._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <Icon name="trash" size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonItem;
