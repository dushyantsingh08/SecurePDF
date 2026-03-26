import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      width: '100%',
      borderTop: '1px solid rgba(255,215,0,0.15)',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 40px' }}>
        {/* Top row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(255,215,0,0.25)'
            }}>
              <span style={{ color: '#000', fontFamily: 'Space Mono, monospace', fontSize: '14px', fontWeight: 700 }}>S</span>
            </div>
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.3em',
              textTransform: 'uppercase'
            }}>SECURE_PDF</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {['Privacy Policy', 'Terms of Service', 'Client Support'].map(link => (
              <a
                key={link}
                href="#"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '10px',
                  color: '#888',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 700,
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Divider + bottom row */}
        <div style={{ borderTop: '1px solid rgba(255,215,0,0.1)', paddingTop: '32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
            © {new Date().getFullYear()} SECURE_PDF. ALL SYSTEMS OPERATIONAL.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '8px', height: '8px', background: 'rgba(255,215,0,0.3)', display: 'inline-block' }} />
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#888', letterSpacing: '0.15em', fontWeight: 700 }}>
              VERSION: 2.0.4-LATEST
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
