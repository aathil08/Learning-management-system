import { useState, useEffect } from 'react';
import { fetchComments, addComment, deleteComment } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { timeAgo } from '../../utils/helpers';
import Icon from '../common/Icon';

const CommentSection = ({ lessonId }) => {
  const { user }              = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [posting, setPosting]   = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    fetchComments(lessonId)
      .then(res => setComments(res.data.comments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handlePost = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      const res = await addComment({ text, lessonId });
      setComments(prev => [res.data.comment, ...prev]);
      setText('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post comment.');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteComment(id);
      setComments(prev => prev.filter(c => c._id !== id));
    } catch {}
  };

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="message" size={17} color="var(--teal)" />
        Comments ({comments.length})
      </h3>

      {/* Post comment box */}
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Share your thoughts about this lesson..."
          rows={3}
          style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: 14, width: '100%', resize: 'none', fontFamily: 'inherit', outline: 'none' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button onClick={handlePost} disabled={posting || !text.trim()}
            style={{ background: posting || !text.trim() ? 'var(--bg2)' : 'linear-gradient(135deg,#0ea5e9,#6366f1)', border: 'none', color: posting || !text.trim() ? 'var(--text3)' : '#fff', borderRadius: 9, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: posting || !text.trim() ? 'not-allowed' : 'pointer' }}>
            {posting ? 'Posting…' : 'Post Comment'}
          </button>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <div style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', padding: 20 }}>Loading comments...</div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text3)', fontSize: 13 }}>
          No comments yet. Be the first!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {comments.map(c => (
            <div key={c._id} style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {c.author?.avatar
                  ? <img src={c.author.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <Icon name="user" size={16} color="#fff" />}
              </div>
              <div style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{c.author?.name}</span>
                    {c.author?.role === 'instructor' && <span style={{ background: 'rgba(14,165,233,0.15)', color: 'var(--teal)', padding: '1px 7px', borderRadius: 99, fontSize: 10, fontWeight: 800 }}>Instructor</span>}
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{timeAgo(c.createdAt)}</span>
                  </div>
                  {user?._id === c.author?._id && (
                    <button onClick={() => handleDelete(c._id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 2 }}>
                      <Icon name="trash" size={13} />
                    </button>
                  )}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
