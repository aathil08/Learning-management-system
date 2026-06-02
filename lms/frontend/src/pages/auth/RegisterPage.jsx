import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/common/Icon';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const inp = { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', color: 'var(--text)', fontSize: 14, width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' };
  const lbl = { color: 'var(--text3)', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'fixed', top: '25%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 22, padding: '44px 40px', maxWidth: 440, width: '100%', animation: 'scaleIn .3s cubic-bezier(.23,1,.32,1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Icon name="book" size={24} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>Join LearnFlow</h1>
          <p style={{ color: 'var(--text3)', fontSize: 14 }}>Start your learning journey today</p>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '11px 16px', color: '#ef4444', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          {[['name','Full Name','text','Mohamed Aathil'],['email','Email','email','you@example.com']].map(([k,l,t,ph]) => (
            <div key={k}><label style={lbl}>{l}</label><input type={t} value={form[k]} onChange={set(k)} placeholder={ph} required style={inp} /></div>
          ))}
          <div>
            <label style={lbl}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min 6 characters" required style={{ ...inp, paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 0 }}>
                <Icon name={showPwd ? 'eyeOff' : 'eye'} size={16} />
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ background: loading ? 'var(--bg3)' : 'linear-gradient(135deg,#0ea5e9,#6366f1)', border: 'none', color: '#fff', borderRadius: 11, padding: '13px', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><span style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} /> Creating...</> : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--teal2)', fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
