import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/common/Icon';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const u = await login(form.email, form.password);
      // Admin/instructor → admin dashboard; student → student dashboard
      navigate(u.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  const inp = { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', color: 'var(--text)', fontSize: 14, width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      {/* Left decorative panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg,#0b0f1a 0%,#0f2540 50%,#0b1a2e 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Icon name="book" size={28} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 900, letterSpacing: -1, marginBottom: 14, color: 'var(--text)' }}>LearnFlow</h1>
          <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.7, maxWidth: 320 }}>Empower your learning journey. Create, teach, and grow with our modern LMS platform.</p>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 36 }}>
            {[['book','50+ Courses'],['users','2K+ Students'],['award','Expert Instructors']].map(([icon, text]) => (
              <div key={text} style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--teal)', marginBottom: 6 }}><Icon name={icon} size={20} color="var(--teal)" /></div>
                <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div style={{ width: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'var(--bg2)' }}>
        <div style={{ width: '100%', maxWidth: 380, animation: 'slideUp .4s ease' }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 900, marginBottom: 6, color: 'var(--text)' }}>Welcome back</h2>
          <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 28 }}>Sign in to continue learning</p>

          {error && <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '11px 16px', color: '#ef4444', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ color: 'var(--text3)', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required style={inp} />
            </div>
            <div>
              <label style={{ color: 'var(--text3)', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="••••••••" required style={{ ...inp, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 0 }}>
                  <Icon name={showPwd ? 'eyeOff' : 'eye'} size={16} />
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ background: loading ? 'var(--bg3)' : 'linear-gradient(135deg,#0ea5e9,#6366f1)', border: 'none', color: '#fff', borderRadius: 11, padding: '13px', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><span style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} /> Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: 10 }}>
            <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0, textAlign: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--teal2)' }}>Admin Login:</span> admin123@gmail.com / admin123
            </p>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, marginTop: 16 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--teal2)', fontWeight: 700 }}>Register as Student</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
