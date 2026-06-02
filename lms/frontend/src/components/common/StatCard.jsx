import Icon from './Icon';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div style={{
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '22px',
    position: 'relative', overflow: 'hidden',
    transition: 'transform .2s, box-shadow .2s',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${color}22`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div style={{ position: 'absolute', top: -14, right: -14, width: 80, height: 80, borderRadius: '50%', background: color + '18' }} />
    <div style={{ width: 42, height: 42, borderRadius: 11, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, color }}>
      <Icon name={icon} size={20} color={color} />
    </div>
    <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', fontFamily: "'Fraunces', serif" }}>{value}</div>
    <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600, marginTop: 4 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{sub}</div>}
  </div>
);

export default StatCard;
