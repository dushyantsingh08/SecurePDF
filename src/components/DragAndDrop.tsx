import React, { useState, useRef, type DragEvent, type ChangeEvent } from 'react';

interface DragAndDropProps {
  files: File[];
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
  files,
  onFilesSelected,
  maxFiles = 5,
  acceptedFileTypes,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };

  const processFiles = (newFilesList: FileList | null) => {
    if (!newFilesList) return;
    const newFiles = Array.from(newFilesList);
    onFilesSelected([...files, ...newFiles].slice(0, maxFiles));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => processFiles(e.target.files);

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;
    const updated = [...files];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onFilesSelected(updated);
  };

  const removeFile = (i: number) => onFilesSelected(files.filter((_, idx) => idx !== i));

  return (
    <div style={{ width: '100%', fontFamily: 'Inter, sans-serif' }}>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          position: 'relative',
          border: `1px dashed ${isDragging ? '#FFD700' : 'rgba(255,215,0,0.3)'}`,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 32px',
          textAlign: 'center',
          background: isDragging ? 'rgba(255,215,0,0.04)' : 'transparent',
          transition: 'all 0.25s ease',
          overflow: 'hidden'
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)'; e.currentTarget.style.background = 'rgba(255,215,0,0.02)'; }}
        onMouseLeave={e => { if (!isDragging) { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)'; e.currentTarget.style.background = 'transparent'; }}}
      >
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,215,0,0.07) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.5, pointerEvents: 'none'
        }} />

        <input type="file" ref={fileInputRef} onChange={handleFileInput} style={{ display: 'none' }} multiple={maxFiles > 1} accept={acceptedFileTypes} />

        {/* PDF icon */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '44px', height: '56px',
          border: '1px solid rgba(255,215,0,0.3)',
          marginBottom: '28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,215,0,0.08)'
        }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#FFD700', fontWeight: 700 }}>PDF</span>
        </div>

        <h3 style={{ position: 'relative', zIndex: 1, fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 700, color: '#e8e8e8', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '10px' }}>
          Initialize Payload
        </h3>
        <p style={{ position: 'relative', zIndex: 1, fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '36px', fontWeight: 700 }}>
          Source: Local Intake // Limit: {maxFiles}
        </p>

        <button style={{
          position: 'relative', zIndex: 1,
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          color: '#000',
          fontFamily: 'Space Mono, monospace',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          padding: '14px 36px',
          border: 'none',
          pointerEvents: 'none'
        }}>
          SELECT FILES →
        </button>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,215,0,0.1)', paddingTop: '28px' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.3em', display: 'block', marginBottom: '16px', fontWeight: 700, opacity: 0.7 }}>
            Queue Status: {files.length} Object{files.length > 1 ? 's' : ''} Detected
          </span>
          <ul style={{ border: '1px solid rgba(255,215,0,0.1)' }}>
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: index < files.length - 1 ? '1px solid rgba(255,215,0,0.08)' : 'none',
                  background: 'rgba(0,0,0,0.2)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,215,0,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.2)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflow: 'hidden', flex: 1 }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#FFD700', fontWeight: 700, opacity: 0.6, flexShrink: 0 }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {maxFiles > 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '4px', flexShrink: 0 }}>
                      <button
                        disabled={index === 0}
                        onClick={e => { e.stopPropagation(); moveFile(index, 'up'); }}
                        style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#888', background: 'none', border: 'none', cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0 : 1, lineHeight: 1, padding: '2px 4px' }}
                      >▲</button>
                      <button
                        disabled={index === files.length - 1}
                        onClick={e => { e.stopPropagation(); moveFile(index, 'down'); }}
                        style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#888', background: 'none', border: 'none', cursor: index === files.length - 1 ? 'default' : 'pointer', opacity: index === files.length - 1 ? 0 : 1, lineHeight: 1, padding: '2px 4px' }}
                      >▼</button>
                    </div>
                  )}

                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#e8e8e8', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); removeFile(index); }}
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '9px',
                    color: '#888',
                    background: 'none',
                    border: '1px solid transparent',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = 'transparent'; }}
                >
                  ABORT_INTAKE
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;