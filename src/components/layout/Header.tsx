import React from 'react';

interface HeaderProps {
  onResetTool: () => void;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onResetTool, onNavigate }) => {
  return (
    <header className="w-full border-b border-black/[0.08] sticky top-0 z-50 bg-white/95 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => { onResetTool(); onNavigate('home'); }}
        >
          <div className="w-9 h-9 border border-black flex items-center justify-center transition-colors bg-white shadow-sm">
            <span className="text-black font-mono text-sm font-bold">S</span>
          </div>
          <span className="font-mono text-[13px] font-bold text-black tracking-tight uppercase hidden sm:inline border-l-2 border-black/10 pl-8 h-5 flex items-center">
            SECURE_PDF
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-12">
          <button
            onClick={() => { onResetTool(); onNavigate('protocols'); }}
            className="font-mono text-xs text-gray-600 hover:text-black uppercase tracking-widest transition-colors font-bold cursor-pointer"
          >
            Protocols
          </button>
          <button 
            onClick={() => { onResetTool(); onNavigate('docs'); }}
            className="font-mono text-xs text-gray-600 hover:text-black uppercase tracking-widest transition-colors font-bold cursor-pointer"
          >
            Docs
          </button>
          <button 
            onClick={() => { onResetTool(); onNavigate('about'); }}
            className="font-mono text-xs text-gray-600 hover:text-black uppercase tracking-widest transition-colors font-bold cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* CTA */}
        <button
          onClick={() => { onResetTool(); onNavigate('protocols'); }}
          className="bg-black text-white font-mono text-xs uppercase tracking-widest px-8 py-3.5 transition-all cursor-pointer hover:bg-gray-800 font-bold"
        >
          Initialize Engine →
        </button>
      </div>
    </header>
  );
};

export default Header;
