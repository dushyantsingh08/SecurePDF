import React from 'react';
import { pdfTools } from '../data/pdfTools';

const Docs: React.FC = () => {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gray-50/20 text-black font-sans pb-24">
      {/* Header section */}
      <section className="w-full border-b border-black/[0.08] bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-24 pb-20">
          <span className="font-mono text-[11px] text-gray-500 uppercase tracking-[0.4em] mb-6 block font-bold border-l-2 border-black/20 pl-4">
            System Documentation // TECHNICAL SPECIFICATIONS
          </span>
          <h1 className="font-sans text-5xl md:text-7xl font-bold tracking-tighter mb-8 max-w-4xl text-black">
            Protocol Registry.
          </h1>
          <p className="font-sans text-lg md:text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
            Detailed technical documentation for every supported PDF transformation available within the local processing environment.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <section className="w-full">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pdfTools.map((tool) => (
              <div 
                key={tool.id}
                className="group relative border-2 border-black/[0.05] bg-white transition-all hover:border-black/20 hover:shadow-2xl hover:shadow-black/5 flex flex-col h-full"
              >
                <div className="p-8 md:p-10 flex flex-col flex-1 h-full">
                  
                  {/* Category Tag */}
                  <span className="inline-block px-3 py-1 bg-gray-100 font-mono text-[10px] text-gray-500 uppercase tracking-widest font-bold self-start mb-6 rounded-none">
                    {tool.category}_PROTOCOL
                  </span>

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <span className="w-10 h-10 border-2 border-black flex items-center justify-center font-mono text-xs font-bold bg-white group-hover:bg-black group-hover:text-white transition-colors">
                      {tool.operation.slice(0, 1).toUpperCase()}
                    </span>
                    <h2 className="font-sans text-2xl font-bold text-black tracking-tight leading-none group-hover:underline decoration-2 underline-offset-4">
                      {tool.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-base text-gray-600 leading-relaxed font-medium mb-8 flex-1">
                    {tool.description}
                  </p>

                  <div className="border-t border-black/[0.05] pt-6 flex flex-col gap-3">
                     <div className="flex items-center justify-between">
                         <span className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-widest">Type:</span>
                         <span className="font-mono text-xs text-black font-bold uppercase tracking-widest">{tool.tag}</span>
                     </div>
                     <div className="flex items-center justify-between">
                         <span className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-widest">Environment:</span>
                         <span className="font-mono text-[10px] text-green-600 font-bold uppercase tracking-widest">LOCAL_SANDBOX</span>
                     </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Docs;
