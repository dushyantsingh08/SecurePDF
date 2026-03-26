import React from 'react';
import { type PDFActionType } from '../components/PDFtoolCard';
import { formatBytes } from '../utils/utils';

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
  originalSize?: number;
}

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label style={{
    fontFamily: 'Space Mono, monospace',
    fontSize: '10px',
    color: '#FFD700',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    display: 'block',
    marginBottom: '12px',
    opacity: 0.8
  }}>
    {children}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    style={{
      width: '100%',
      background: 'rgba(255,215,0,0.03)',
      border: '1px solid rgba(255,215,0,0.15)',
      padding: '14px 20px',
      fontFamily: 'Space Mono, monospace',
      fontSize: '13px',
      color: '#e8e8e8',
      outline: 'none',
      transition: 'all 0.2s ease',
      ...props.style
    }}
    onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)'}
    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.15)'}
  />
);


const ToolConfig: React.FC<ToolConfigProps> = ({ operation, values, onChange, fileCount = 0, originalSize = 0 }) => {
  const set = (patch: Partial<ToolConfigValues>) => onChange({ ...values, ...patch });

  if (fileCount === 0) return null;

  const getEstimatedSize = (level: string) => {
    if (!originalSize) return 'Calculating...';
    let ratio = 0.7;
    if (level === 'extreme') ratio = 0.4;
    if (level === 'high_fidelity') ratio = 0.9;
    return formatBytes(originalSize * ratio);
  };

  switch (operation) {
    // ---- ROTATE ----
    case 'rotate':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <Label>Rotation Angle</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {([90, 180, 270] as const).map(deg => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => set({ rotateDegrees: deg })}
                  style={{
                    padding: '14px 0',
                    border: `1px solid ${values.rotateDegrees === deg ? '#FFD700' : 'rgba(255,215,0,0.1)'}`,
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    background: values.rotateDegrees === deg ? '#FFD700' : 'rgba(0,0,0,0.2)',
                    color: values.rotateDegrees === deg ? '#000' : '#888',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Page Selection</Label>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {(['all', 'range'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => set({ rotatePageMode: mode })}
                  style={{
                    padding: '10px 24px',
                    border: `1px solid ${values.rotatePageMode === mode ? '#FFD700' : 'rgba(255,215,0,0.1)'}`,
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    background: values.rotatePageMode === mode ? '#FFD700' : 'rgba(0,0,0,0.2)',
                    color: values.rotatePageMode === mode ? '#000' : '#888',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {mode === 'all' ? 'All Pages' : 'Custom Range'}
                </button>
              ))}
            </div>
            {values.rotatePageMode === 'range' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <Label>Page Ranges</Label>
            <Input
              type="text"
              placeholder="e.g. 1-5, 8, 11-15"
              value={values.splitRanges ?? ''}
              onChange={e => set({ splitRanges: e.target.value })}
            />
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '12px', fontWeight: 700 }}>
              Separate ranges with commas. Each range produces an output file.
            </p>
          </div>
        </div>
      );

    // ---- DELETE PAGES ----
    case 'delete':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <Label>Pages to Remove</Label>
            <Input
              type="text"
              placeholder="e.g. 2, 4, 7-9"
              value={values.deletePages ?? ''}
              onChange={e => set({ deletePages: e.target.value })}
            />
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '12px', fontWeight: 700 }}>
              Separate individual pages or ranges with commas.
            </p>
          </div>
        </div>
      );

    // ---- WATERMARK ----
    case 'watermark':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
              style={{ width: '100%', accentColor: '#FFD700', cursor: 'pointer', background: 'rgba(255,215,0,0.1)', height: '4px', borderRadius: '0' }}
            />
          </div>
        </div>
      );

    // ---- PROTECT / ENCRYPT ----
    case 'protect':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <Label>User Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={values.password ?? ''}
              onChange={e => set({ password: e.target.value })}
            />
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '12px', fontWeight: 700 }}>
              This password will be required to open the document. [System: Local Encryption Active]
            </p>
          </div>
        </div>
      );

    // ---- COMPRESS ----
    case 'compress':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {([
            { id: 'extreme', label: 'Extreme', desc: 'Max reduction, reduced quality', bar: '100%' },
            { id: 'recommended', label: 'Recommended', desc: 'Balanced quality & size', bar: '66%' },
            { id: 'high_fidelity', label: 'High Fidelity', desc: 'Near-lossless, minimal reduction', bar: '33%' },
          ] as const).map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => set({ compressLevel: opt.id })}
              style={{
                border: `1px solid ${values.compressLevel === opt.id ? '#FFD700' : 'rgba(255,215,0,0.1)'}`,
                padding: '24px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: values.compressLevel === opt.id ? 'rgba(255,215,0,0.08)' : 'rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: values.compressLevel === opt.id ? '#FFD700' : '#aaa' }}>{opt.label}</span>
                {values.compressLevel === opt.id && originalSize > 0 && (
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#22c55e', fontWeight: 700 }}>~{getEstimatedSize(opt.id)}</span>
                )}
              </div>
              <div style={{ height: '2px', width: '100%', background: 'rgba(255,215,0,0.1)' }}>
                <div style={{ height: '100%', background: '#FFD700', width: opt.bar, opacity: values.compressLevel === opt.id ? 1 : 0.3 }} />
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888', fontWeight: 500 }}>{opt.desc}</span>
            </button>
          ))}
        </div>
      );

    // ---- REORDER ----
    case 'reorder':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <Label>New Page Order</Label>
            <Input
              type="text"
              placeholder="e.g. 3, 1, 2 (for a 3-page doc)"
              value={values.reorderInput ?? ''}
              onChange={e => set({ reorderInput: e.target.value })}
            />
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '12px', fontWeight: 700 }}>
              Enter page numbers in the desired output order.
            </p>
          </div>
        </div>
      );

    // ---- IMAGE EXPORT (JPG / PNG) ----
    case 'pdf-to-jpg':
    case 'pdf-to-png':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <Label>Render DPI: {values.imageDpi ?? 150}</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '8px' }}>
              {([72, 150, 300] as const).map(dpi => (
                <button
                  key={dpi}
                  type="button"
                  onClick={() => set({ imageDpi: dpi })}
                  style={{
                    padding: '14px 0',
                    border: `1px solid ${values.imageDpi === dpi ? '#FFD700' : 'rgba(255,215,0,0.1)'}`,
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: values.imageDpi === dpi ? '#FFD700' : 'rgba(0,0,0,0.2)',
                    color: values.imageDpi === dpi ? '#000' : '#888',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {dpi} DPI
                </button>
              ))}
            </div>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '12px', fontWeight: 700 }}>
              Higher DPI = better quality but larger file size.
            </p>
          </div>
        </div>
      );

    default:
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Automated protocol active. No configuration required.
          </span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#22c55e', fontWeight: 700, textTransform: 'uppercase' }}>READY_TO_PROCEED</span>
        </div>
      );
  }
};

export default ToolConfig;
