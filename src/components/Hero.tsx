import React from 'react';

interface HeroProps {
  onExploreTools: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExploreTools }) => {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center overflow-hidden bg-white">
      {/* Background layers */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      <div className="absolute inset-0 scanlines pointer-events-none" />
      <div className="absolute inset-0 dither-overlay pointer-events-none" />

      {/* Crosshair markers */}
      <span className="absolute top-6 left-6 md:top-10 md:left-12 lg:left-20 font-mono text-[11px] text-black/20 select-none pointer-events-none">+</span>
      <span className="absolute top-6 right-6 md:top-10 md:right-12 lg:right-20 font-mono text-[11px] text-black/20 select-none pointer-events-none">+</span>
      <span className="absolute bottom-6 left-6 md:bottom-10 md:left-12 lg:left-20 font-mono text-[11px] text-black/20 select-none pointer-events-none">+</span>
      <span className="absolute bottom-6 right-6 md:bottom-10 md:right-12 lg:right-20 font-mono text-[11px] text-black/20 select-none pointer-events-none">+</span>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 py-20 flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
        
        {/* Left: Text block */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <span className="font-mono text-[11px] text-gray-600 uppercase tracking-[0.4em] mb-8 block font-bold">
            Protocol Version 2.0.4 // LOCAL
          </span>

          <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-bold text-black leading-[0.95] tracking-tighter mb-10">
            RECONSTRUCTING
            <br />
            <span className="text-gray-300">PDF SYSTEMS</span>
          </h1>

          <p className="font-sans text-base md:text-lg text-gray-600 leading-relaxed max-w-md mx-auto lg:ml-0 mb-12 font-medium">
            Professional-grade tools for document manipulation. Execute complex transformations entirely within your secure browser environment.
          </p>

          <button
            onClick={onExploreTools}
            className="group bg-black text-white font-mono text-sm uppercase tracking-[0.2em] px-12 py-5 transition-all cursor-pointer inline-flex items-center gap-5 hover:bg-gray-800 font-bold shadow-xl"
          >
            Launch Tools
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* Right: Dithered geometric illustration */}
        <div className="flex-1 flex items-center justify-center w-full lg:w-auto">
          <div className="relative w-full max-w-[420px] aspect-square">
            {/* Orbital rings */}
            <svg viewBox="0 0 400 400" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="180" stroke="black" strokeWidth="0.8" opacity="0.08" />
              <circle cx="200" cy="200" r="140" stroke="black" strokeWidth="0.8" opacity="0.06" />
              <circle cx="200" cy="200" r="100" stroke="black" strokeWidth="0.8" opacity="0.12" />
              
              <line x1="200" y1="20" x2="200" y2="380" stroke="black" strokeWidth="0.5" opacity="0.06" />
              <line x1="20" y1="200" x2="380" y2="200" stroke="black" strokeWidth="0.5" opacity="0.06" />

              <rect x="165" y="135" width="70" height="90" fill="black" />
              <rect x="170" y="140" width="60" height="80" fill="white" />
              <line x1="178" y1="160" x2="222" y2="160" stroke="black" strokeWidth="1.5" opacity="0.3" />
              <line x1="178" y1="175" x2="222" y2="175" stroke="black" strokeWidth="1.5" opacity="0.25" />
              <line x1="178" y1="190" x2="210" y2="190" stroke="black" strokeWidth="1.5" opacity="0.15" />

              <circle cx="200" cy="20" r="3" fill="black" opacity="0.4" />
              <circle cx="380" cy="200" r="3" fill="black" opacity="0.4" />
              <circle cx="200" cy="380" r="3" fill="black" opacity="0.4" />
              <circle cx="20" cy="200" r="3" fill="black" opacity="0.4" />
            </svg>

            {/* Floating labels */}
            <span className="absolute top-[8%] right-0 font-mono text-[11px] text-gray-800 tracking-widest uppercase font-bold">
              AUTH_LINK.active
            </span>
            <span className="absolute bottom-[8%] left-0 font-mono text-[11px] text-gray-800 tracking-widest uppercase font-bold">
              SECURE_PROC.ALPHA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
