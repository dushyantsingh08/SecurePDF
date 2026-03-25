import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t-2 border-black/[0.08] bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-14">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-white shadow-md">
              <span className="text-black font-mono text-sm font-bold">S</span>
            </div>
            <span className="font-mono text-sm text-black uppercase tracking-[0.4em] font-bold">SECURE_PDF</span>
          </div>
          <div className="flex items-center gap-10">
            <a href="#" className="font-mono text-[11px] text-gray-500 hover:text-black uppercase tracking-widest transition-colors font-bold">Privacy Policy</a>
            <a href="#" className="font-mono text-[11px] text-gray-500 hover:text-black uppercase tracking-widest transition-colors font-bold">Terms of Service</a>
            <a href="#" className="font-mono text-[11px] text-gray-500 hover:text-black uppercase tracking-widest transition-colors font-bold">Client Support</a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-black/[0.05] pt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-gray-400 uppercase tracking-widest font-bold">
            © {new Date().getFullYear()} SECURE_PDF. ALL SYSTEMS OPERATIONAL.
          </p>
          <div className="flex items-center gap-6">
            <span className="w-2 h-2 bg-black/[0.1]" />
            <p className="font-mono text-[11px] text-gray-500 tracking-[0.2em] font-bold">
              VERSION: 2.0.4-LATEST
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
