const STYLE = {
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '11px 14px',
  color: 'var(--text)',
  fontSize: 14,
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color .2s',
};

const LBL = {
  color: 'var(--text3)',
  fontSize: 11,
  fontWeight: 700,
  display: 'block',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
};

export const Input = ({ label, ...props }) => (
  <div>
    {label && <label style={LBL}>{label}</label>}
    <input {...props} style={STYLE} />
  </div>
);

export const Textarea = ({ label, rows = 4, ...props }) => (
  <div>
    {label && <label style={LBL}>{label}</label>}
    <textarea rows={rows} {...props} style={{ ...STYLE, resize: 'vertical' }} />
  </div>
);

export const Select = ({ label, children, ...props }) => (
  <div>
    {label && <label style={LBL}>{label}</label>}
    <select {...props} style={STYLE}>{children}</select>
  </div>
);

export const FormGroup = ({ children, cols = 1 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
    {children}
  </div>
);
