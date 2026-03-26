import React from 'react';

interface HeroProps {
  onExploreTools: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExploreTools }) => {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: '88vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1520 50%, #0f0f0f 100%)'
    }}>
      {/* Background layers */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      <div className="absolute inset-0 scanlines pointer-events-none" />
      <div className="absolute inset-0 dither-overlay pointer-events-none" />

      {/* Gold glow orb */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Corner markers */}
      {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
        <span
          key={i}
          className={`absolute ${pos}`}
          style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'rgba(255,215,0,0.2)', pointerEvents: 'none', userSelect: 'none' }}
        >+</span>
      ))}

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        padding: '80px 40px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '80px',
        flexWrap: 'wrap'
      }}>
        {/* Left: Text block */}
        <div style={{ flex: 1, minWidth: '280px', maxWidth: '560px' }}>
          <span style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            color: '#FFD700',
            textTransform: 'uppercase',
            letterSpacing: '0.4em',
            display: 'block',
            marginBottom: '32px',
            fontWeight: 700,
            opacity: 0.7
          }}>
            Protocol Version 2.0.4 // LOCAL
          </span>

          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(42px, 6vw, 80px)',
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            marginBottom: '32px',
            color: '#e8e8e8'
          }}>
            RECONSTRUCTING
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>PDF SYSTEMS</span>
          </h1>

          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            color: '#888',
            lineHeight: 1.7,
            maxWidth: '420px',
            marginBottom: '48px',
            fontWeight: 400
          }}>
            Professional-grade tools for document manipulation. Execute complex transformations entirely within your secure browser environment.
          </p>

          <button
            onClick={onExploreTools}
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000',
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              padding: '18px 48px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Launch Tools
            <span>→</span>
          </button>
        </div>

        {/* Right: Geometric illustration */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '420px', aspectRatio: '1' }}>
            <svg viewBox="0 0 400 400" fill="none" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="180" stroke="#FFD700" strokeWidth="0.8" opacity="0.08" />
              <circle cx="200" cy="200" r="140" stroke="#FFD700" strokeWidth="0.8" opacity="0.06" />
              <circle cx="200" cy="200" r="100" stroke="#FFD700" strokeWidth="0.8" opacity="0.12" />
              <line x1="200" y1="20" x2="200" y2="380" stroke="#FFD700" strokeWidth="0.5" opacity="0.06" />
              <line x1="20" y1="200" x2="380" y2="200" stroke="#FFD700" strokeWidth="0.5" opacity="0.06" />
              {/* PDF icon */}
              <rect x="165" y="135" width="70" height="90" fill="#FFD700" opacity="0.9" />
              <rect x="170" y="140" width="60" height="80" fill="#111" />
              <line x1="178" y1="160" x2="222" y2="160" stroke="#FFD700" strokeWidth="1.5" opacity="0.5" />
              <line x1="178" y1="175" x2="222" y2="175" stroke="#FFD700" strokeWidth="1.5" opacity="0.4" />
              <line x1="178" y1="190" x2="210" y2="190" stroke="#FFD700" strokeWidth="1.5" opacity="0.3" />
              {/* Dots */}
              <circle cx="200" cy="20" r="3" fill="#FFD700" opacity="0.5" />
              <circle cx="380" cy="200" r="3" fill="#FFD700" opacity="0.5" />
              <circle cx="200" cy="380" r="3" fill="#FFD700" opacity="0.5" />
              <circle cx="20" cy="200" r="3" fill="#FFD700" opacity="0.5" />
            </svg>
            <span style={{ position: 'absolute', top: '8%', right: 0, fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#FFD700', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.6 }}>
              AUTH_LINK.active
            </span>
            <span style={{ position: 'absolute', bottom: '8%', left: 0, fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#FFD700', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.6 }}>
              SECURE_PROC.ALPHA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
