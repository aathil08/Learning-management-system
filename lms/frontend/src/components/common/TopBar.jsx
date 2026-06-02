import Icon from './Icon';

const TopBar = ({ title, subtitle, action }) => (
  <div style={{
    position: 'sticky', top: 0,
    background: 'rgba(11,15,26,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    zIndex: 50, height: 62,
    display: 'flex', alignItems: 'center',
    padding: '0 32px', gap: 16,
  }}>
    <div style={{ flex: 1 }}>
      {title && <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', margin: 0 }}>{title}</h1>}
      {subtitle && <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0 }}>{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export default TopBar;
