import React from 'react';

const About: React.FC = () => {
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
            System Origin // MANIFESTO
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
            maxWidth: '900px'
          }}>
            Absolute Control Over Your Data.
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#777', maxWidth: '600px', lineHeight: 1.8 }}>
            Secure PDF was engineered with a singular, uncompromising principle: local execution. No payloads to cloud servers. No unauthorized background processes. Mathematical transformations of your documents directly inside your browser.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <section style={{ width: '100%' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '80px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '64px' }}>
            
            {/* Column 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
              <div>
                <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '28px', fontWeight: 700, color: '#e8e8e8', letterSpacing: '-0.02em', marginBottom: '20px' }}>The Architecture</h2>
                <p style={{ fontFamily: 'Inter, sans-serif', color: '#aaa', lineHeight: 1.8, marginBottom: '16px', fontSize: '15px' }}>
                  Traditional PDF utilities are fundamentally flawed. They mandate the upload of sensitive, proprietary documents to third-party endpoints. This introduces latency, violates compliance policies, and exposes confidential information to unnecessary risk.
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', color: '#aaa', lineHeight: 1.8, fontSize: '15px' }}>
                  We built an alternative. By leveraging advanced WebAssembly (WASM) and local client-side computation, the entire PDF rendering, manipulation, and structural serialization engine runs within the isolated sandbox of your browser environment.
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,215,0,0.12)', paddingTop: '48px' }}>
                <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '28px', fontWeight: 700, color: '#e8e8e8', letterSpacing: '-0.02em', marginBottom: '24px' }}>Our Protocol</h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    'Intercept Payload',
                    'Parse Structure locally',
                    'Execute Transformations',
                    'Deliver Output directly to disk',
                  ].map((step, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
                      <span style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        color: '#000',
                        fontWeight: 700,
                        fontSize: '11px',
                        flexShrink: 0
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div style={{
                background: 'rgba(255,215,0,0.04)',
                border: '1px solid rgba(255,215,0,0.15)',
                padding: '40px',
                height: '100%'
              }}>
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '10px',
                  color: '#FFD700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '32px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(255,215,0,0.12)',
                  opacity: 0.7
                }}>
                  System Attributes
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {[
                    { title: 'Zero Data Retention', desc: 'Because your files never leave your computer, there is no database storing them. State is erased the moment you close the tab.' },
                    { title: 'Open Standard Infrastructure', desc: 'Built on industry-standard open source libraries handling the raw byte arrays securely and deterministically.' },
                    { title: 'Brutalist Efficiency', desc: 'The interface sheds all aesthetic waste. What remains is a high-contrast, functional console engineered for maximum workflow velocity.' },
                  ].map(({ title, desc }) => (
                    <div key={title}>
                      <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#FFD700', marginBottom: '8px' }}>{title}</h3>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#aaa', lineHeight: 1.7 }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
