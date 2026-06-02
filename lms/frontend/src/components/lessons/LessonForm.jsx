import { useState, useRef } from 'react';
import Modal from '../common/Modal';
import { Input, Textarea, FormGroup } from '../common/Input';
import Btn from '../common/Btn';
import Icon from '../common/Icon';

// Format seconds to mm:ss or hh:mm:ss
const formatDuration = (secs) => {
  if (!secs || isNaN(secs)) return '';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
};

// Convert any YouTube URL to embed URL (for validation/preview)
const toEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  return '';
};

const LessonForm = ({ courseId, lesson, onClose, onSave, loading }) => {
  // Determine initial videoType from existing lesson
  const initVideoType = lesson?.videoType || (lesson?.videoUrl && !lesson.videoType ? 'upload' : 'upload');

  const [form, setForm] = useState({
    title:       lesson?.title       || '',
    description: lesson?.description || '',
    order:       lesson?.order       || 0,
    duration:    lesson?.duration    || '',
    isFree:      lesson?.isFree      ?? false,
    courseId,
  });

  const [videoType,   setVideoType]   = useState(initVideoType);   // 'upload' | 'youtube'
  const [videoFile,   setVideoFile]   = useState(null);
  const [youtubeUrl,  setYoutubeUrl]  = useState(
    lesson?.videoType === 'youtube' ? lesson.videoUrl : ''
  );
  const [attachFile,  setAttachFile]  = useState(null);
  const [durationMsg, setDurationMsg] = useState('');
  const hiddenVideoRef = useRef(null);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // ── Auto-detect duration from uploaded video file ──
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setDurationMsg('Detecting duration…');

    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    const url = URL.createObjectURL(file);
    tempVideo.src = url;
    tempVideo.onloadedmetadata = () => {
      const dur = formatDuration(tempVideo.duration);
      URL.revokeObjectURL(url);
      if (dur) {
        setForm(f => ({ ...f, duration: dur }));
        setDurationMsg(`✓ Duration auto-detected: ${dur}`);
      } else {
        setDurationMsg('Could not detect duration — enter manually.');
      }
    };
    tempVideo.onerror = () => {
      URL.revokeObjectURL(url);
      setDurationMsg('Could not read video metadata. Enter duration manually.');
    };
  };

  // ── Validate YouTube URL ──
  const youtubeEmbed = toEmbedUrl(youtubeUrl);
  const youtubeValid = youtubeUrl.trim() === '' || youtubeEmbed !== '';

  const handleSave = () => {
    if (!form.title.trim()) { alert('Title is required.'); return; }

    // Prevent submitting both
    if (videoType === 'upload' && videoFile && youtubeUrl.trim()) {
      alert('Please use either an uploaded video OR a YouTube URL, not both.');
      return;
    }

    if (videoType === 'youtube') {
      if (!youtubeUrl.trim()) { alert('Please enter a YouTube URL.'); return; }
      if (!youtubeEmbed)      { alert('Invalid YouTube URL. Example: https://www.youtube.com/watch?v=abc123'); return; }
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('videoType', videoType);

    if (videoType === 'upload' && videoFile) fd.append('video', videoFile);
    if (videoType === 'youtube')             fd.append('youtubeUrl', youtubeUrl.trim());
    if (attachFile)                          fd.append('file', attachFile);

    onSave(fd);
  };

  /* ── Styles ── */
  const tabBtn = (active) => ({
    flex: 1, padding: '10px 0', borderRadius: 9, border: 'none',
    background: active ? 'linear-gradient(135deg,#0ea5e9,#6366f1)' : 'var(--bg2)',
    color: active ? '#fff' : 'var(--text3)',
    fontWeight: 700, fontSize: 13, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    transition: 'all .2s',
  });

  const dropZone = {
    background: 'var(--bg3)', border: '2px dashed var(--border2)',
    borderRadius: 12, padding: '20px 16px', textAlign: 'center',
  };

  return (
    <Modal onClose={onClose} title={lesson ? '✏️ Edit Lesson' : '📹 Add New Lesson'} maxWidth={540}>
      <div style={{ display: 'grid', gap: 18 }}>

        {/* Title + Description */}
        <Input label="Lesson Title *" value={form.title} onChange={set('title')} placeholder="e.g. Introduction to Hooks" />
        <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="What does this lesson cover?" rows={2} />

        {/* Order + Duration */}
        <FormGroup cols={2}>
          <Input label="Order" type="number" value={form.order} onChange={set('order')} min={0} />
          <div>
            <Input
              label="Duration (e.g. 12:30)"
              value={form.duration}
              onChange={set('duration')}
              placeholder="mm:ss"
            />
            {durationMsg && (
              <p style={{ fontSize: 11, color: durationMsg.startsWith('✓') ? '#10b981' : 'var(--text3)', marginTop: 4, fontWeight: 600 }}>
                {durationMsg}
              </p>
            )}
          </div>
        </FormGroup>

        {/* ── Video Source Selector ── */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
            Video Source
          </label>
          <div style={{ display: 'flex', gap: 8, background: 'var(--bg3)', borderRadius: 11, padding: 4 }}>
            <button type="button" onClick={() => setVideoType('upload')} style={tabBtn(videoType === 'upload')}>
              <Icon name="upload" size={14} color={videoType === 'upload' ? '#fff' : 'var(--text3)'} />
              Upload Video
            </button>
            <button type="button" onClick={() => setVideoType('youtube')} style={tabBtn(videoType === 'youtube')}>
              <Icon name="video" size={14} color={videoType === 'youtube' ? '#fff' : 'var(--text3)'} />
              YouTube URL
            </button>
          </div>
        </div>

        {/* ── Upload Video ── */}
        {videoType === 'upload' && (
          <div style={dropZone}>
            <Icon name="upload" size={28} color="var(--teal)" />
            <p style={{ color: 'var(--text2)', fontSize: 13, margin: '8px 0 10px', fontWeight: 600 }}>
              Choose a video file
            </p>
            <p style={{ color: 'var(--text3)', fontSize: 11, marginBottom: 10 }}>
              Duration will be auto-detected from the video
            </p>
            <input
              type="file" accept="video/*"
              onChange={handleVideoFileChange}
              style={{ color: 'var(--text2)', fontSize: 12, width: '100%' }}
            />
            {videoFile && (
              <p style={{ color: 'var(--teal)', fontSize: 12, marginTop: 8, fontWeight: 700 }}>
                ✓ {videoFile.name}
              </p>
            )}
            {lesson?.videoType === 'upload' && lesson.videoUrl && !videoFile && (
              <p style={{ color: 'var(--text3)', fontSize: 11, marginTop: 6 }}>
                Current: {lesson.videoUrl.split('/').pop()}
              </p>
            )}
          </div>
        )}

        {/* ── YouTube URL ── */}
        {videoType === 'youtube' && (
          <div style={{ display: 'grid', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                YouTube URL *
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{
                  background: 'var(--bg3)', border: `1px solid ${youtubeValid ? 'var(--border)' : '#ef4444'}`,
                  borderRadius: 10, padding: '11px 14px', color: 'var(--text)',
                  fontSize: 14, width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none',
                }}
              />
              {youtubeUrl && !youtubeEmbed && (
                <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4, fontWeight: 600 }}>
                  ⚠ Invalid YouTube URL. Use format: https://www.youtube.com/watch?v=VIDEO_ID
                </p>
              )}
              {youtubeEmbed && (
                <p style={{ color: '#10b981', fontSize: 11, marginTop: 4, fontWeight: 600 }}>
                  ✓ Valid YouTube URL
                </p>
              )}
            </div>

            {/* YouTube preview */}
            {youtubeEmbed && (
              <div style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
                <iframe
                  src={youtubeEmbed}
                  title="YouTube preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                />
              </div>
            )}

            <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 10, padding: '10px 14px' }}>
              <p style={{ color: 'var(--text3)', fontSize: 11, margin: 0 }}>
                💡 Supported formats: <code>youtube.com/watch?v=ID</code> or <code>youtu.be/ID</code>
                <br />Enter duration manually above. YouTube Data API v3 required for auto-fetch.
              </p>
            </div>
          </div>
        )}

        {/* ── File Attachment ── */}
        <div style={dropZone}>
          <Icon name="file" size={22} color="var(--amber)" />
          <p style={{ color: 'var(--text2)', fontSize: 13, margin: '6px 0 8px', fontWeight: 600 }}>
            Attach Resource File
          </p>
          <p style={{ color: 'var(--text3)', fontSize: 11, marginBottom: 8 }}>PDF, DOCX, PPTX, ZIP</p>
          <input
            type="file" accept=".pdf,.docx,.pptx,.zip"
            onChange={e => setAttachFile(e.target.files[0])}
            style={{ color: 'var(--text2)', fontSize: 12, width: '100%' }}
          />
          {attachFile && (
            <p style={{ color: 'var(--amber)', fontSize: 12, marginTop: 6, fontWeight: 700 }}>✓ {attachFile.name}</p>
          )}
        </div>

        {/* ── Free Preview toggle ── */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: 'var(--text2)', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
          <input
            type="checkbox"
            checked={form.isFree}
            onChange={e => setForm(f => ({ ...f, isFree: e.target.checked }))}
          />
          <div>
            <div style={{ fontWeight: 700 }}>Free Preview Lesson</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>Students can watch this before enrolling</div>
          </div>
        </label>
      </div>

      <Btn onClick={handleSave} loading={loading} size="lg" style={{ width: '100%', marginTop: 22 }}>
        {lesson ? 'Save Changes' : 'Add Lesson'}
      </Btn>
    </Modal>
  );
};

export default LessonForm;
