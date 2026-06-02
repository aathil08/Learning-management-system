const ProgressBar = ({ percent, color = 'var(--teal)', height = 6, showLabel = true }) => (
  <div>
    {showLabel && (
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
        <span style={{ color: 'var(--text2)' }}>Progress</span>
        <span style={{ color, fontWeight: 700 }}>{percent}%</span>
      </div>
    )}
    <div style={{ height, background: 'var(--bg3)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${percent}%`,
        background: percent === 100
          ? 'linear-gradient(90deg,#10b981,#059669)'
          : `linear-gradient(90deg,${color},${color}bb)`,
        borderRadius: 99,
        transition: 'width 1s ease',
      }} />
    </div>
  </div>
);

export default ProgressBar;
