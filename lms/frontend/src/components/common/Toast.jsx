import Icon from './Icon';

const Toast = ({ message, type = 'success', onClose }) => {
  const cfg = {
    success: { bg: '#10b981', icon: 'check' },
    error:   { bg: '#ef4444', icon: 'x' },
    warning: { bg: '#f59e0b', icon: 'bell' },
  };
  const { bg, icon } = cfg[type] || cfg.success;

  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      background: bg, color: '#fff',
      padding: '13px 20px', borderRadius: 12,
      fontWeight: 700, fontSize: 14,
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      animation: 'toastIn .3s ease', maxWidth: 360,
    }}>
      <Icon name={icon} size={16} color="#fff" />
      {message}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', marginLeft: 6, padding: 0, display: 'flex' }}>
        <Icon name="x" size={14} color="#fff" />
      </button>
    </div>
  );
};

export default Toast;
