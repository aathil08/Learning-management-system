import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../api/services';
import Toast from '../../components/common/Toast';
import useToast from '../../hooks/useToast';
import Icon from '../../components/common/Icon';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) { setAvatarFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('bio',  form.bio);
      if (avatarFile) fd.append('avatar', avatarFile);
      await updateProfile(fd);
      await refreshUser();
      showToast('Profile updated!');
    } catch { showToast('Failed to update profile.', 'error'); }
    finally { setLoading(false); }
  };

  const inp = { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', color: 'var(--text)', fontSize: 14, width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' };
  const lbl = { color: 'var(--text3)', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 };

  return (
    <div style={{ padding: '32px', animation: 'fadeIn .3s ease' }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 28 }}>My Profile</h1>

      <div style={{ maxWidth: 560 }}>
        {/* Avatar */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: 28, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--teal)' }}>
              {preview || user?.avatar
                ? <img src={preview || user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <Icon name="user" size={36} color="#fff" />}
            </div>
            <label htmlFor="avatar-upload" style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--teal)', border: '2px solid var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon name="edit" size={13} color="#fff" />
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </label>
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{user?.name}</h2>
            <span style={{ background: user?.role === 'instructor' ? 'rgba(14,165,233,0.15)' : 'rgba(139,92,246,0.15)', color: user?.role === 'instructor' ? 'var(--teal)' : '#8b5cf6', padding: '3px 12px', borderRadius: 99, fontSize: 12, fontWeight: 800, textTransform: 'capitalize' }}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: 28 }}>
          <div style={{ display: 'grid', gap: 18 }}>
            <div>
              <label style={lbl}>Full Name</label>
              <input value={form.name} onChange={set('name')} style={inp} />
            </div>
            <div>
              <label style={lbl}>Email</label>
              <input value={user?.email} disabled style={{ ...inp, opacity: 0.5, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={lbl}>Bio</label>
              <textarea value={form.bio} onChange={set('bio')} rows={3} placeholder="Tell us about yourself..." style={{ ...inp, resize: 'vertical' }} />
            </div>
          </div>
          <button onClick={handleSave} disabled={loading}
            style={{ marginTop: 22, background: loading ? 'var(--bg3)' : 'linear-gradient(135deg,#0ea5e9,#6366f1)', border: 'none', color: '#fff', borderRadius: 11, padding: '12px 28px', fontSize: 14, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            {loading ? <><span style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} /> Saving...</> : 'Save Changes'}
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default ProfilePage;
