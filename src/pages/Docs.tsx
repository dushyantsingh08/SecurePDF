import React from 'react';
import { pdfTools } from '../data/pdfTools';

const Docs: React.FC = () => {
  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 72px)', background: '#0a0a0a', color: '#e8e8e8', fontFamily: 'Inter, sans-serif', paddingBottom: '80px' }}>

      {/* Header section */}
      <section style={{
        width: '100%',
        borderBottom: '1px solid rgba(255,215,0,0.12)',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1520 100%)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '80px 40px 64px' }}>
          <span style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            color: '#FFD700',
            textTransform: 'uppercase',
            letterSpacing: '0.4em',
            display: 'block',
            marginBottom: '24px',
            fontWeight: 700,
            opacity: 0.7,
            borderLeft: '2px solid rgba(255,215,0,0.4)',
            paddingLeft: '16px'
          }}>
            System Documentation // TECHNICAL SPECIFICATIONS
          </span>
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(36px, 5vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            maxWidth: '700px'
          }}>
            Protocol Registry.
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#777', maxWidth: '540px', lineHeight: 1.8 }}>
            Detailed technical documentation for every supported PDF transformation available within the local processing environment.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <section style={{ width: '100%' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '64px 40px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1px',
            background: 'rgba(255,215,0,0.08)',
            border: '1px solid rgba(255,215,0,0.08)'
          }}>
            {pdfTools.map((tool) => {
              const [hovered, setHovered] = React.useState(false);
              return (
                <div
                  key={tool.id}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  style={{
                    background: hovered ? 'rgba(255,215,0,0.04)' : 'rgba(15,14,12,0.95)',
                    padding: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'background 0.2s ease',
                    borderLeft: hovered ? '2px solid rgba(255,215,0,0.4)' : '2px solid transparent'
                  }}
                >
                  {/* Category Tag */}
                  <span style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '9px',
                    color: '#FFD700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    fontWeight: 700,
                    background: 'rgba(255,215,0,0.1)',
                    display: 'inline-block',
                    padding: '4px 10px',
                    marginBottom: '24px',
                    alignSelf: 'flex-start',
                    opacity: 0.8
                  }}>
                    {tool.category}_PROTOCOL
                  </span>

                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <span style={{
                      width: '36px',
                      height: '36px',
                      border: `1px solid ${hovered ? '#FFD700' : 'rgba(255,215,0,0.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: hovered ? '#000' : '#FFD700',
                      background: hovered ? '#FFD700' : 'transparent',
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}>
                      {tool.operation.slice(0, 1).toUpperCase()}
                    </span>
                    <h2 style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: hovered ? '#FFD700' : '#e8e8e8',
                      letterSpacing: '-0.01em',
                      transition: 'color 0.2s ease'
                    }}>
                      {tool.title}
                    </h2>
                  </div>

                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#aaa', lineHeight: 1.7, flex: 1, marginBottom: '24px' }}>
                    {tool.description}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255,215,0,0.08)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Type:</span>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>{tool.tag}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Environment:</span>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>LOCAL_SANDBOX</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Docs;
