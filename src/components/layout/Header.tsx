import React, { useState } from 'react';

interface HeaderProps {
  onResetTool: () => void;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onResetTool, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Protocols', view: 'protocols' },
    { label: 'Docs', view: 'docs' },
    { label: 'About', view: 'about' },
  ];

  const btnStyle: React.CSSProperties = {
    fontFamily: 'Space Mono, monospace',
    fontSize: '11px',
    color: '#888',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontWeight: 700,
    padding: '4px 0',
  };

  return (
    <header style={{
      width: '100%',
      borderBottom: '1px solid rgba(255,215,0,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(10,10,10,0.95)',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 20px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexShrink: 0 }}
          onClick={() => { onResetTool(); onNavigate('home'); setMenuOpen(false); }}
        >
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#000', fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700 }}>S</span>
          </div>
          <span style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '12px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            SECURE_PDF
          </span>
        </div>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', '@media(max-width:640px)': { display: 'none' } } as React.CSSProperties}
          className="hidden-mobile"
        >
          {navItems.map(({ label, view }) => (
            <button
              key={view}
              onClick={() => { onResetTool(); onNavigate(view); }}
              style={btnStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
              onMouseLeave={e => (e.currentTarget.style.color = '#888')}
            >
              {label}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Desktop CTA */}
          <button
            onClick={() => { onResetTool(); onNavigate('protocols'); }}
            className="hidden-mobile"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000',
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Initialize →
          </button>

          {/* Hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMenuOpen(v => !v)}
            style={{
              background: 'none',
              border: '1px solid rgba(255,215,0,0.3)',
              color: '#FFD700',
              cursor: 'pointer',
              padding: '6px 10px',
              fontSize: '16px',
              lineHeight: 1,
              fontFamily: 'monospace',
            }}
            aria-label="Menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid rgba(255,215,0,0.1)',
          background: 'rgba(10,10,10,0.98)',
          padding: '16px 20px 24px',
        }}>
          {navItems.map(({ label, view }) => (
            <button
              key={view}
              onClick={() => { onResetTool(); onNavigate(view); setMenuOpen(false); }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                fontFamily: 'Space Mono, monospace',
                fontSize: '12px',
                fontWeight: 700,
                color: '#888',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                padding: '14px 0',
                borderBottom: '1px solid rgba(255,215,0,0.07)',
              }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { onResetTool(); onNavigate('protocols'); setMenuOpen(false); }}
            style={{
              marginTop: '16px',
              width: '100%',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000',
              fontFamily: 'Space Mono, monospace',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              padding: '14px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Initialize Engine →
          </button>
        </div>
      )}

      {/* Inline responsive helpers */}
      <style>{`
        .hidden-mobile { display: flex; }
        .show-mobile { display: none; }
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
