import Icon from './Icon';

const Modal = ({ children, onClose, maxWidth = 500, title }) => (
  <div
    onClick={e => e.target === e.currentTarget && onClose()}
    style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.8)',
      zIndex: 200, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn .2s ease', padding: 20,
    }}
  >
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 20, padding: '32px',
      maxWidth, width: '100%',
      position: 'relative',
      maxHeight: '90vh', overflowY: 'auto',
      animation: 'scaleIn .3s cubic-bezier(.23,1,.32,1)',
    }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'var(--bg3)', border: 'none', color: 'var(--text2)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={15} />
          </button>
        </div>
      )}
      {!title && (
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'var(--bg3)', border: 'none', color: 'var(--text2)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="x" size={15} />
        </button>
      )}
      {children}
    </div>
  </div>
);

export default Modal;
