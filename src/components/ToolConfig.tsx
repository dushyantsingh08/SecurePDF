import React from 'react';
import { type PDFActionType } from '../components/PDFtoolCard';

// ---- Shared config type ----
export interface ToolConfigValues {
  // rotate
  rotateDegrees?: 90 | 180 | 270;
  rotatePageMode?: 'all' | 'range';
  rotateStart?: number;
  rotateEnd?: number;
  // split
  splitRanges?: string; // e.g. "1-5, 8, 11-15"
  // delete
  deletePages?: string; // e.g. "2, 4, 7"
  // watermark
  watermarkText?: string;
  watermarkOpacity?: number;
  // protect
  password?: string;
  // compress
  compressLevel?: 'extreme' | 'recommended' | 'high_fidelity';
  // reorder
  reorderInput?: string; // e.g. "3,1,2" new order
  // pdf-to-jpg/png
  imageDpi?: number;
}

interface ToolConfigProps {
  operation: PDFActionType;
  values: ToolConfigValues;
  onChange: (values: ToolConfigValues) => void;
  fileCount?: number;
}

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="font-mono text-[11px] text-gray-600 font-bold uppercase tracking-widest block mb-3">
    {children}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="w-full bg-white border-2 border-black/[0.08] px-5 py-3.5 font-mono text-sm text-black focus:border-black outline-none transition-all placeholder:text-gray-300"
  />
);


const ToolConfig: React.FC<ToolConfigProps> = ({ operation, values, onChange, fileCount = 0 }) => {
  const set = (patch: Partial<ToolConfigValues>) => onChange({ ...values, ...patch });

  if (fileCount === 0) return null;

  switch (operation) {
    // ---- ROTATE ----
    case 'rotate':
      return (
        <div className="flex flex-col gap-8">
          <div>
            <Label>Rotation Angle</Label>
            <div className="grid grid-cols-3 gap-3">
              {([90, 180, 270] as const).map(deg => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => set({ rotateDegrees: deg })}
                  className={`py-4 border-2 font-mono text-sm font-bold uppercase tracking-widest transition-all cursor-pointer
                    ${values.rotateDegrees === deg ? 'border-black bg-black text-white' : 'border-black/[0.1] text-gray-600 hover:border-black/40'}
                  `}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Page Selection</Label>
            <div className="flex gap-3 mb-4">
              {(['all', 'range'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => set({ rotatePageMode: mode })}
                  className={`px-6 py-3 border-2 font-mono text-xs font-bold uppercase tracking-widest transition-all cursor-pointer
                    ${values.rotatePageMode === mode ? 'border-black bg-black text-white' : 'border-black/[0.1] text-gray-600 hover:border-black/40'}
                  `}
                >
                  {mode === 'all' ? 'All Pages' : 'Custom Range'}
                </button>
              ))}
            </div>
            {values.rotatePageMode === 'range' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Page</Label>
                  <Input
                    type="number" min={1} placeholder="1"
                    value={values.rotateStart ?? ''}
                    onChange={e => set({ rotateStart: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>End Page</Label>
                  <Input
                    type="number" min={1} placeholder="5"
                    value={values.rotateEnd ?? ''}
                    onChange={e => set({ rotateEnd: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      );

    // ---- SPLIT ----
    case 'split':
      return (
        <div className="flex flex-col gap-6">
          <div>
            <Label>Page Ranges</Label>
            <Input
              type="text"
              placeholder="e.g. 1-5, 8, 11-15"
              value={values.splitRanges ?? ''}
              onChange={e => set({ splitRanges: e.target.value })}
            />
            <p className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3">
              Separate ranges with commas. Each range produces an output file.
            </p>
          </div>
        </div>
      );

    // ---- DELETE PAGES ----
    case 'delete':
      return (
        <div className="flex flex-col gap-6">
          <div>
            <Label>Pages to Remove</Label>
            <Input
              type="text"
              placeholder="e.g. 2, 4, 7-9"
              value={values.deletePages ?? ''}
              onChange={e => set({ deletePages: e.target.value })}
            />
            <p className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3">
              Separate individual pages or ranges with commas.
            </p>
          </div>
        </div>
      );

    // ---- WATERMARK ----
    case 'watermark':
      return (
        <div className="flex flex-col gap-6">
          <div>
            <Label>Watermark Text</Label>
            <Input
              type="text"
              placeholder="CONFIDENTIAL"
              value={values.watermarkText ?? ''}
              onChange={e => set({ watermarkText: e.target.value })}
            />
          </div>
          <div>
            <Label>Opacity: {((values.watermarkOpacity ?? 0.12) * 100).toFixed(0)}%</Label>
            <input
              type="range" min={5} max={60} step={5}
              value={(values.watermarkOpacity ?? 0.12) * 100}
              onChange={e => set({ watermarkOpacity: parseInt(e.target.value) / 100 })}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        </div>
      );

    // ---- PROTECT / ENCRYPT ----
    case 'protect':
      return (
        <div className="flex flex-col gap-6">
          <div>
            <Label>User Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={values.password ?? ''}
              onChange={e => set({ password: e.target.value })}
            />
            <p className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3">
              This password will be required to open the document.
            </p>
          </div>
        </div>
      );

    // ---- COMPRESS ----
    case 'compress':
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([
            { id: 'extreme', label: 'Extreme', desc: 'Max reduction, reduced quality', bar: 'w-full' },
            { id: 'recommended', label: 'Recommended', desc: 'Balanced quality & size', bar: 'w-2/3' },
            { id: 'high_fidelity', label: 'High Fidelity', desc: 'Near-lossless, minimal reduction', bar: 'w-1/3' },
          ] as const).map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => set({ compressLevel: opt.id })}
              className={`border-2 p-5 text-left transition-all cursor-pointer flex flex-col gap-3
                ${values.compressLevel === opt.id ? 'border-black bg-black/5' : 'border-black/[0.08] bg-white hover:border-black/30'}
              `}
            >
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-black">{opt.label}</span>
              <div className="h-1 w-full bg-black/[0.05] overflow-hidden">
                <div className={`h-full bg-black ${opt.bar}`} />
              </div>
              <span className="font-mono text-[10px] text-gray-400 font-bold uppercase">{opt.desc}</span>
            </button>
          ))}
        </div>
      );

    // ---- REORDER ----
    case 'reorder':
      return (
        <div className="flex flex-col gap-6">
          <div>
            <Label>New Page Order</Label>
            <Input
              type="text"
              placeholder="e.g. 3, 1, 2 (for a 3-page doc)"
              value={values.reorderInput ?? ''}
              onChange={e => set({ reorderInput: e.target.value })}
            />
            <p className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3">
              Enter page numbers in the desired output order.
            </p>
          </div>
        </div>
      );

    // ---- IMAGE EXPORT (JPG / PNG) ----
    case 'pdf-to-jpg':
    case 'pdf-to-png':
      return (
        <div className="flex flex-col gap-6">
          <div>
            <Label>Render DPI: {values.imageDpi ?? 150}</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {([72, 150, 300] as const).map(dpi => (
                <button
                  key={dpi}
                  type="button"
                  onClick={() => set({ imageDpi: dpi })}
                  className={`py-4 border-2 font-mono text-sm font-bold tracking-widest transition-all cursor-pointer
                    ${values.imageDpi === dpi ? 'border-black bg-black text-white' : 'border-black/[0.1] text-gray-600 hover:border-black/40'}
                  `}
                >
                  {dpi} DPI
                </button>
              ))}
            </div>
            <p className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3">
              Higher DPI = better quality but larger file size.
            </p>
          </div>
        </div>
      );

    // Operations that need no extra config
    default:
      return (
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-gray-400 font-bold uppercase">
            Automated protocol active. No configuration required.
          </span>
          <span className="font-mono text-[11px] text-green-600 font-bold">READY_TO_PROCEED</span>
        </div>
      );
  }
};

export default ToolConfig;
