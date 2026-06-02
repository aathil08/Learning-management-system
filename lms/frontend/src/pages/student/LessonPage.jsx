import { useState } from 'react';
import { markLessonComplete } from '../../api/services';
import CommentSection from '../../components/comments/CommentSection';
import Icon from '../../components/common/Icon';

// Convert any YouTube URL format to embed URL
const toEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  return url;
};

const LessonPage = ({ lesson, courseId, completedIds, onBack, onComplete, lessons, onSelectLesson }) => {
  const [marking, setMarking] = useState(false);
  const [marked,  setMarked]  = useState(completedIds.includes(lesson._id));
  const isCompleted = marked || completedIds.includes(lesson._id);

  const handleMarkComplete = async () => {
    if (isCompleted || marking) return;
    setMarking(true);
    try {
      await markLessonComplete({ lessonId: lesson._id, courseId });
      setMarked(true);
      onComplete && onComplete();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark complete.');
    } finally { setMarking(false); }
  };

  const idx  = lessons.findIndex(l => l._id === lesson._id);
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  const isYoutube = lesson.videoType === 'youtube';
  const embedUrl  = isYoutube ? toEmbedUrl(lesson.videoUrl) : null;

  const btnBase = { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 };

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      {/* ── Top Nav ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 28px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
          <Icon name="arrowLeft" size={16} /> Back to Course
        </button>
        <div style={{ flex: 1, textAlign: 'center', overflow: 'hidden' }}>
          <h1 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={() => prev && onSelectLesson(prev)} disabled={!prev}
            style={{ ...btnBase, color: prev ? 'var(--text2)' : 'var(--text3)', cursor: prev ? 'pointer' : 'not-allowed' }}>
            <Icon name="arrowLeft" size={13} /> Prev
          </button>
          <button onClick={() => next && onSelectLesson(next)} disabled={!next}
            style={{ ...btnBase, color: next ? 'var(--text2)' : 'var(--text3)', cursor: next ? 'pointer' : 'not-allowed' }}>
            Next <Icon name="arrow" size={13} />
          </button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', minHeight: 'calc(100vh - 120px)' }}>

        {/* ── Left: Content ── */}
        <div style={{ padding: '28px 32px', overflowY: 'auto' }}>

          {/* ── Video Player ── */}
          {lesson.videoUrl ? (
            <div style={{ background: '#000', borderRadius: 16, overflow: 'hidden', marginBottom: 24, aspectRatio: '16/9', position: 'relative' }}>
              {isYoutube ? (
                <iframe
                  src={embedUrl}
                  title={lesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', inset: 0 }}
                />
              ) : (
                <video
                  src={lesson.videoUrl}
                  controls
                  style={{ width: '100%', height: '100%', display: 'block' }}
                />
              )}
            </div>
          ) : (
            <div style={{ background: 'var(--bg3)', border: '2px dashed var(--border2)', borderRadius: 16, height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Icon name="video" size={42} color="var(--text3)" />
              <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 10 }}>No video for this lesson.</p>
            </div>
          )}

          {/* ── Lesson Header ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
            <div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>{lesson.title}</h2>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {lesson.duration && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text3)' }}>
                    <Icon name="clock" size={14} color="var(--text3)" />{lesson.duration}
                  </span>
                )}
                {isYoutube && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#ef4444' }}>
                    <Icon name="video" size={14} color="#ef4444" />YouTube Video
                  </span>
                )}
                {lesson.isFree && (
                  <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 800 }}>FREE PREVIEW</span>
                )}
              </div>
            </div>

            <button onClick={handleMarkComplete} disabled={isCompleted || marking}
              style={{
                background: isCompleted ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg,#0ea5e9,#6366f1)',
                border: isCompleted ? '1px solid rgba(16,185,129,0.4)' : 'none',
                color: isCompleted ? '#10b981' : '#fff',
                borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 800,
                cursor: isCompleted ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', flexShrink: 0,
              }}>
              <Icon name="check" size={15} color={isCompleted ? '#10b981' : '#fff'} />
              {isCompleted ? 'Completed ✓' : marking ? 'Marking…' : 'Mark Complete'}
            </button>
          </div>

          {lesson.description && (
            <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>{lesson.description}</p>
          )}

          {/* ── File Attachment ── */}
          {lesson.fileUrl && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="file" size={20} color="#f59e0b" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{lesson.fileName || 'Attachment'}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>Lesson resource file</div>
              </div>
              <a href={lesson.fileUrl} download target="_blank" rel="noreferrer"
                style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                <Icon name="download" size={13} color="#f59e0b" /> Download
              </a>
            </div>
          )}

          {/* ── Comments ── */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
            <CommentSection lessonId={lesson._id} />
          </div>
        </div>

        {/* ── Right Sidebar: Lesson List ── */}
        <div style={{ background: 'var(--bg2)', borderLeft: '1px solid var(--border)', overflowY: 'auto', padding: '20px 14px' }}>
          <h3 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14, padding: '0 4px' }}>
            Course Lessons
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {lessons.map((l, i) => {
              const active = l._id === lesson._id;
              const done   = completedIds.includes(l._id);
              return (
                <button key={l._id} onClick={() => onSelectLesson(l)}
                  style={{ background: active ? 'rgba(14,165,233,0.12)' : 'transparent', border: `1px solid ${active ? 'var(--teal)' : 'transparent'}`, borderRadius: 10, padding: '10px 12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, width: '100%', transition: 'all .15s' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: done ? '#10b98120' : active ? 'rgba(14,165,233,0.2)' : 'var(--bg3)', border: `2px solid ${done ? '#10b981' : active ? 'var(--teal)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                    {done ? <Icon name="check" size={12} color="#10b981" /> : <span style={{ color: active ? 'var(--teal)' : 'var(--text3)' }}>{i + 1}</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: active ? 800 : 600, color: active ? 'var(--teal2)' : 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                      {l.duration && <span style={{ fontSize: 10, color: 'var(--text3)' }}>{l.duration}</span>}
                      {l.videoType === 'youtube' && <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>YT</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
