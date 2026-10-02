export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.02)',
      backdropFilter: 'blur(12px)',
      padding: '1rem 1.5rem',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}>
        {/* Logo dot */}
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          boxShadow: '0 0 8px rgba(99,102,241,0.5)',
        }} />
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Healthify
        </span>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Made with{' '}
          <span style={{ color: '#f43f5e', fontSize: '0.9rem' }}>❤</span>
          {' '}for your well-being
        </span>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.6 }}>
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
