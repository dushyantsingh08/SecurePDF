import { useState } from 'react';
import PDFCard, { type PDFActionType } from './components/PDFtoolCard';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/Hero';
import ToolWorkspace from './components/ToolWorkspace';
import About from './pages/About';
import Docs from './pages/Docs';
import { pdfTools } from './data/pdfTools';

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

  const categories = [
    { id: 'popular', label: 'Recommended' },
    { id: 'editing', label: 'Editing' },
    { id: 'security', label: 'Security' },
    { id: 'optimization', label: 'Optimization' },
    { id: 'conversion', label: 'Conversion' },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
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
              <section className="w-full text-center py-16 md:py-20 px-6 border-t border-black/[0.08] bg-gray-50/10">
                <h2 className="font-sans text-4xl md:text-5xl font-bold text-black tracking-tight mb-4">
                  Powerful PDF Tools
                </h2>
                <p className="font-sans text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto">
                  Everything runs locally. Your files never leave your device.
                </p>
              </section>
            </>
          )}

          {/* Category Filter */}
          <section id="tools" className="scroll-mt-16 w-full border-t border-black/[0.08] bg-gray-50/20">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-10 flex border-b border-black/[0.05] overflow-x-auto no-scrollbar gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-8 py-3 font-mono text-xs uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap font-bold
                     ${activeCategory === cat.id
                      ? 'bg-black text-white'
                      : 'text-gray-400 hover:text-black hover:bg-black/5'
                    }
                   `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </section>

          {/* Tools Grid */}
          <section className="w-full">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
              {/* Section header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="flex-1">
                  <span className="font-mono text-[11px] text-gray-600 uppercase tracking-[0.4em] mb-4 block font-bold">
                    Protocol Intake // {activeCategory.toUpperCase()}
                  </span>
                  <h2 className="font-sans text-3xl md:text-5xl font-bold text-black tracking-tight">
                    {activeCategory === 'popular' ? 'Primary Operations' : `${categories.find(c => c.id === activeCategory)?.label} Suite`}
                  </h2>
                </div>
                <div className="flex-1 md:text-right">
                  <p className="font-sans text-[15px] text-gray-500 max-w-sm ml-auto leading-relaxed font-medium">
                    All transformations execute in your secure environment. No payload leaves your local system architecture.
                  </p>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.1] border border-black/[0.1]">
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

          {/* Infrastructure Stats block */}
          <section className="w-full border-y border-black/[0.08] bg-gray-50/30">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-24">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { label: 'System_Latency', value: '0.00ms', desc: 'Local compute active' },
                  { label: 'Processing_Mode', value: 'WASM', desc: 'Secure client-side' },
                  { label: 'Network_Exposures', value: '00.0', desc: 'Isolated sandbox' },
                  { label: 'Deployment_Nodes', value: 'V.2.0.4', desc: 'Origin protocol' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-5">
                    <span className="font-mono text-[11px] text-gray-500 uppercase tracking-widest font-bold border-l-2 border-black/10 pl-6 h-4 flex items-center">
                      {stat.label}
                    </span>
                    <div>
                      <div className="font-sans text-3xl md:text-4xl font-bold text-black tracking-tighter mb-2">{stat.value}</div>
                      <div className="font-mono text-[11px] text-gray-400 font-bold uppercase tracking-widest">{stat.desc}</div>
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
