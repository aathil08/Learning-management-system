const variants = {
  primary:  { background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', color: '#fff', border: 'none' },
  amber:    { background: 'linear-gradient(135deg,#f59e0b,#ef4444)', color: '#fff', border: 'none' },
  ghost:    { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)' },
  danger:   { background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
  success:  { background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' },
};

const Btn = ({ children, variant = 'primary', size = 'md', loading, icon, style: s, ...props }) => {
  const sz = size === 'sm' ? { padding: '7px 14px', fontSize: 12 }
           : size === 'lg' ? { padding: '14px 28px', fontSize: 16 }
           : { padding: '10px 20px', fontSize: 14 };
  return (
    <button
      disabled={loading}
      {...props}
      style={{
        ...variants[variant], ...sz,
        borderRadius: 10, fontWeight: 700,
        fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        transition: 'all .2s', ...s,
      }}
    >
      {loading ? <span style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} /> : icon}
      {children}
    </button>
  );
};

export default Btn;
