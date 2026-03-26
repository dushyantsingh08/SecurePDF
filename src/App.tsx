import { useState } from 'react';
import PDFCard, { type PDFActionType } from './components/PDFtoolCard';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/Hero';
import ToolWorkspace from './components/ToolWorkspace';
import About from './pages/About';
import Docs from './pages/Docs';
import { pdfTools } from './data/pdfTools';

const categories = [
  { id: 'popular', label: 'Recommended' },
  { id: 'editing', label: 'Editing' },
  { id: 'security', label: 'Security' },
  { id: 'optimization', label: 'Optimization' },
  { id: 'conversion', label: 'Conversion' },
];

function App() {
  const [selectedTool, setSelectedTool] = useState<PDFActionType | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('popular');
  const [currentView, setCurrentView] = useState<'home' | 'protocols' | 'about' | 'docs'>('home');

  const handleToolClick = (operation: PDFActionType) => {
    setSelectedTool(operation);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedToolData = pdfTools.find(t => t.operation === selectedTool);

  const filteredTools = pdfTools.filter(tool => {
    if (activeCategory === 'popular') return tool.isPopular;
    return tool.category === activeCategory;
  });

  const scrollToTools = () => {
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <Header
        onResetTool={() => setSelectedTool(null)}
        onNavigate={(view: string) => {
          setSelectedTool(null);
          setCurrentView(view as any);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
      />

      {selectedTool && selectedToolData ? (
        <ToolWorkspace
          toolData={selectedToolData}
          onBack={() => setSelectedTool(null)}
        />
      ) : currentView === 'about' ? (
        <About />
      ) : currentView === 'docs' ? (
        <Docs />
      ) : (
        <>
          {currentView === 'home' && (
            <>
              <Hero onExploreTools={scrollToTools} />

              {/* Intro blurb */}
              <section style={{
                width: '100%',
                textAlign: 'center',
                padding: '80px 40px',
                borderTop: '1px solid rgba(255,215,0,0.1)',
                background: 'rgba(255,215,0,0.02)'
              }}>
                <h2 style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  marginBottom: '16px',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Powerful PDF Tools
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#aaa', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
                  Everything runs locally. Your files never leave your device.
                </p>
              </section>
            </>
          )}

          {/* Category Filter */}
          <section id="tools" style={{ width: '100%', borderTop: '1px solid rgba(255,215,0,0.1)', background: 'rgba(0,0,0,0.3)', scrollMarginTop: '72px' }}>
            <div style={{
              maxWidth: '1440px',
              margin: '0 auto',
              padding: '0 40px',
              display: 'flex',
              borderBottom: '1px solid rgba(255,215,0,0.08)',
              overflowX: 'auto',
              gap: '4px'
            }}
              className="no-scrollbar"
            >
              {categories.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: '18px 28px',
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      border: 'none',
                      background: active ? 'rgba(255,215,0,0.12)' : 'transparent',
                      color: active ? '#FFD700' : '#888',
                      borderBottom: `2px solid ${active ? '#FFD700' : 'transparent'}`,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#aaa'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#888'; }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Tools Grid */}
          <section style={{ width: '100%', flex: 1 }}>
            <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '60px 40px' }}>
              {/* Section header */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginBottom: '48px' }}>
                <div>
                  <span style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '10px',
                    color: '#FFD700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4em',
                    display: 'block',
                    marginBottom: '12px',
                    fontWeight: 700,
                    opacity: 0.7
                  }}>
                    Protocol Intake // {activeCategory.toUpperCase()}
                  </span>
                  <h2 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(24px, 3vw, 40px)',
                    fontWeight: 800,
                    color: '#e8e8e8',
                    letterSpacing: '-0.02em',
                    margin: 0
                  }}>
                    {activeCategory === 'popular' ? 'Primary Operations' : `${categories.find(c => c.id === activeCategory)?.label} Suite`}
                  </h2>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#888', maxWidth: '360px', lineHeight: 1.7 }}>
                  All transformations execute in your secure environment. No payload leaves your local system.
                </p>
              </div>

              {/* Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1px',
                background: 'rgba(255,215,0,0.08)',
                border: '1px solid rgba(255,215,0,0.08)'
              }}>
                {filteredTools.map((tool, i) => (
                  <PDFCard
                    key={tool.id}
                    data={tool}
                    index={i}
                    onClick={handleToolClick}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Stats block */}
          <section style={{ width: '100%', borderTop: '1px solid rgba(255,215,0,0.1)', borderBottom: '1px solid rgba(255,215,0,0.1)', background: 'rgba(255,215,0,0.02)' }}>
            <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '80px 40px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px' }}>
                {[
                  { label: 'System_Latency', value: '0.00ms', desc: 'Local compute active' },
                  { label: 'Processing_Mode', value: 'WASM', desc: 'Secure client-side' },
                  { label: 'Network_Exposures', value: '00.0', desc: 'Isolated sandbox' },
                  { label: 'Deployment_Nodes', value: 'V.2.0.4', desc: 'Origin protocol' },
                ].map((stat, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <span style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '10px',
                      color: '#FFD700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      fontWeight: 700,
                      borderLeft: '2px solid rgba(255,215,0,0.3)',
                      paddingLeft: '16px',
                      opacity: 0.7
                    }}>
                      {stat.label}
                    </span>
                    <div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '36px', fontWeight: 800, color: '#e8e8e8', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                        {stat.value}
                      </div>
                      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
                        {stat.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}

export default App;
