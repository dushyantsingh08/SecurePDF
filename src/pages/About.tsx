import React from 'react';

const About: React.FC = () => {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-white text-black font-sans pb-24">
      {/* Header section */}
      <section className="w-full border-b border-black/[0.08] bg-gray-50/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-24 pb-20">
          <span className="font-mono text-[11px] text-gray-500 uppercase tracking-[0.4em] mb-6 block font-bold border-l-2 border-black/20 pl-4">
            System Origin // MANIFESTO
          </span>
          <h1 className="font-sans text-5xl md:text-7xl font-bold tracking-tighter mb-8 max-w-4xl text-black">
            Absolute Control Over Your Data.
          </h1>
          <p className="font-sans text-lg md:text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
            Secure PDF was engineered with a singular, uncompromising principle: local execution. No payloads to cloud servers. No unauthorized background processes. Mathematical transformations of your documents directly inside your browser.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <section className="w-full">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-16">
              <div>
                 <h2 className="font-sans text-3xl font-bold text-black tracking-tight mb-6">The Architecture</h2>
                 <p className="font-sans text-gray-600 leading-relaxed font-medium mb-4">
                   Traditional PDF utilities are fundamentally flawed. They mandate the upload of sensitive, proprietary documents to third-party endpoints. This introduces latency, violates compliance policies, and exposes confidential information to unnecessary risk.
                 </p>
                 <p className="font-sans text-gray-600 leading-relaxed font-medium">
                   We built an alternative. By leveraging advanced WebAssembly (WASM) and local client-side computation, the entire PDF rendering, manipulation, and structural serialization engine runs within the isolated sandbox of your browser environment.
                 </p>
              </div>

              <div className="border-t border-black/10 pt-16">
                 <h2 className="font-sans text-3xl font-bold text-black tracking-tight mb-6">Our Protocol</h2>
                 <ul className="flex flex-col gap-6 font-mono text-xs text-gray-600 uppercase tracking-widest font-bold">
                   <li className="flex items-center gap-4">
                     <span className="w-8 h-8 flex items-center justify-center bg-black text-white">01</span>
                     Intercept Payload
                   </li>
                   <li className="flex items-center gap-4">
                     <span className="w-8 h-8 flex items-center justify-center bg-black text-white">02</span>
                     Parse Structure locally
                   </li>
                   <li className="flex items-center gap-4">
                     <span className="w-8 h-8 flex items-center justify-center bg-black text-white">03</span>
                     Execute Transformations
                   </li>
                   <li className="flex items-center gap-4">
                     <span className="w-8 h-8 flex items-center justify-center bg-black text-white">04</span>
                     Deliver Output directly to disk
                   </li>
                 </ul>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-16">
               <div className="bg-gray-50/50 border-2 border-black/[0.05] p-10 md:p-14">
                 <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-6 block border-b border-black/[0.05] pb-4">
                   System Attributes
                 </span>
                 <div className="flex flex-col gap-8">
                   <div>
                     <h3 className="font-sans font-bold text-xl text-black tracking-tight mb-2">Zero Data Retention</h3>
                     <p className="font-sans text-sm text-gray-600 font-medium leading-relaxed">Because your files never leave your computer, there is no database storing them. State is erased the moment you close the tab.</p>
                   </div>
                   <div>
                     <h3 className="font-sans font-bold text-xl text-black tracking-tight mb-2">Open Standard Infrastructure</h3>
                     <p className="font-sans text-sm text-gray-600 font-medium leading-relaxed">Built on industry-standard open source libraries handling the raw byte arrays securely and deterministically.</p>
                   </div>
                   <div>
                     <h3 className="font-sans font-bold text-xl text-black tracking-tight mb-2">Brutalist Efficiency</h3>
                     <p className="font-sans text-sm text-gray-600 font-medium leading-relaxed">The interface sheds all aesthetic waste. What remains is a high-contrast, functional console engineered for maximum workflow velocity.</p>
                   </div>
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
