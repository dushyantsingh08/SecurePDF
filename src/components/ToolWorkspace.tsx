import React, { useState } from 'react';
import DragAndDrop from './DragAndDrop';
import ToolConfig, { type ToolConfigValues } from './ToolConfig';
import PDFEditor from './PDFEditor';
import { type PDFOperationData } from '../data/pdfTools';
import {
  mergePdfs,
  compressPdf,
  downloadBlob,
  rotatePdf,
  deletePages,
  addWatermark,
  flattenPdf,
  splitPdf,
  reorderPages,
  convertToDocx,
  extractText,
  encryptPdf,
} from '../utils/utils';

interface ToolWorkspaceProps {
  toolData: PDFOperationData;
  onBack: () => void;
}

function parseRanges(input: string): [number, number][] {
  return input
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const parts = s.split('-').map(n => parseInt(n.trim()));
      return parts.length === 2 ? [parts[0], parts[1]] : [parts[0], parts[0]];
    }) as [number, number][];
}

function parsePageNumbers(input: string): number[] {
  const pages: number[] = [];
  parseRanges(input).forEach(([s, e]) => {
    for (let i = s; i <= e; i++) pages.push(i);
  });
  return [...new Set(pages)];
}

const S = {
  section: {
    width: '100%',
    minHeight: 'calc(100vh - 72px)',
    display: 'flex',
    flexDirection: 'column' as const,
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1520 50%, #0f0f0f 100%)',
    color: '#e8e8e8',
    fontFamily: 'Inter, sans-serif',
  },
  topBar: {
    borderBottom: '1px solid rgba(255,215,0,0.15)',
    padding: '18px 40px',
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '11px',
    color: '#FFD700',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.2em',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'opacity 0.2s ease',
  },
  inner: {
    flex: 1,
    maxWidth: '1100px',
    margin: '0 auto',
    width: '100%',
    padding: '64px 40px',
  },
  panel: {
    border: '1px solid rgba(255,215,0,0.15)',
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)',
  },
  panelHeader: {
    borderBottom: '1px solid rgba(255,215,0,0.1)',
    padding: '16px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(0,0,0,0.3)',
  },
  panelLabel: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '10px',
    color: '#FFD700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.2em',
    fontWeight: 700,
    opacity: 0.8,
  },
  panelBody: {
    padding: '36px',
  },
};

const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ toolData, onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [config, setConfig] = useState<ToolConfigValues>({
    rotateDegrees: 90,
    rotatePageMode: 'all',
    compressLevel: 'recommended',
    watermarkOpacity: 0.12,
    imageDpi: 150,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // --- Edit PDF ---
  if (toolData.operation === 'edit') {
    if (files.length > 0) {
      return <PDFEditor file={files[0]} onDiscard={() => setFiles([])} />;
    }
    return (
      <section style={S.section}>
        <div style={S.topBar}>
          <button style={S.backBtn} onClick={onBack} onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            ← BACK TO PROTOCOLS
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ maxWidth: '640px', width: '100%' }}>
            <div style={{ marginBottom: '48px', textAlign: 'center' }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.4em', display: 'block', marginBottom: '16px', fontWeight: 700, opacity: 0.7 }}>
                Canvas Editor // SELECT PAYLOAD
              </span>
              <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, background: 'linear-gradient(135deg,#FFD700,#FFA500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.02em', marginBottom: '16px' }}>
                Edit PDF
              </h1>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#aaa', lineHeight: 1.7 }}>
                Select a PDF to open the visual canvas editor with drawing, highlighting, and text tools.
              </p>
            </div>
            <DragAndDrop files={files} onFilesSelected={setFiles} acceptedFileTypes=".pdf" maxFiles={1} />
          </div>
        </div>
      </section>
    );
  }

  const handleExecute = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setStatus('processing');
    setErrorMsg('');
    try {
      let result: Uint8Array | undefined;
      let filename = `${toolData.title.toUpperCase().replace(/\s/g, '_')}_${Date.now()}`;
      let contentType = 'application/pdf';

      switch (toolData.operation) {
        case 'merge':
          result = await mergePdfs(files);
          filename += '.pdf';
          break;
        case 'compress':
          result = await compressPdf(files[0], config.compressLevel);
          filename += '.pdf';
          break;
        case 'rotate': {
          const pageRange = config.rotatePageMode === 'all'
            ? 'all'
            : { start: (config.rotateStart ?? 1) - 1, end: (config.rotateEnd ?? 1) - 1 };
          result = await rotatePdf(files[0], config.rotateDegrees ?? 90, pageRange as any);
          filename += '.pdf';
          break;
        }
        case 'split': {
          if (!config.splitRanges?.trim()) throw new Error('Please enter page ranges to split.');
          const ranges = parseRanges(config.splitRanges);
          const splitResult = await splitPdf(files[0], ranges);
          splitResult.forEach((bytes, i) => {
            downloadBlob(bytes, `SPLIT_${String(i + 1).padStart(2, '0')}_${Date.now()}.pdf`);
          });
          setStatus('done');
          return;
        }
        case 'delete': {
          if (!config.deletePages?.trim()) throw new Error('Please enter pages to delete.');
          const nums = parsePageNumbers(config.deletePages);
          result = await deletePages(files[0], nums);
          filename += '.pdf';
          break;
        }
        case 'watermark': {
          const text = config.watermarkText?.trim() || 'CONFIDENTIAL';
          const opacity = config.watermarkOpacity ?? 0.12;
          result = await addWatermark(files[0], text, opacity);
          filename += '.pdf';
          break;
        }
        case 'flatten':
          result = await flattenPdf(files[0]);
          filename += '.pdf';
          break;
        case 'reorder': {
          if (!config.reorderInput?.trim()) throw new Error('Please enter the new page order.');
          const order = config.reorderInput.split(',').map(n => parseInt(n.trim()));
          result = await reorderPages(files[0], order);
          filename += '.pdf';
          break;
        }
        case 'pdf-to-docx':
          result = await convertToDocx(files[0]);
          filename += '.docx';
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case 'pdf-to-txt': {
          const text = await extractText(files[0]);
          result = new TextEncoder().encode(text);
          filename += '.txt';
          contentType = 'text/plain';
          break;
        }
        case 'protect': {
          if (!config.password?.trim()) throw new Error('Please enter a password.');
          result = await encryptPdf(files[0], config.password.trim());
          filename += '.pdf';
          break;
        }
        default:
          throw new Error(`${toolData.operation} protocol is being integrated.`);
      }

      if (result) {
        downloadBlob(result, filename, contentType);
        setStatus('done');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Unknown execution failure.');
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section style={S.section}>
      {/* Top bar */}
      <div style={S.topBar}>
        <button style={S.backBtn} onClick={onBack} onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
          ← BACK TO PROTOCOLS
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 700 }}>
            PROTOCOL_INTAKE: {toolData.tag}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', background: status === 'processing' ? '#FFD700' : 'rgba(255,215,0,0.15)', transition: 'background 0.3s' }} />
            <div style={{ width: '8px', height: '8px', background: status === 'done' ? '#22c55e' : 'rgba(255,215,0,0.15)', transition: 'background 0.3s' }} />
          </div>
        </div>
      </div>

      {/* Main workspace */}
      <div style={S.inner}>
        {/* Title block */}
        <div style={{ marginBottom: '48px', borderLeft: '2px solid rgba(255,215,0,0.4)', paddingLeft: '28px' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.4em', display: 'block', marginBottom: '12px', fontWeight: 700, opacity: 0.7 }}>
            Execution Interface // {toolData.operation}
          </span>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '16px', background: 'linear-gradient(135deg,#FFD700,#FFA500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {toolData.title}
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#aaa', lineHeight: 1.7, maxWidth: '560px' }}>
            {toolData.description}
          </p>
        </div>

        {/* Upload panel */}
        <div style={S.panel}>
          <div style={S.panelHeader}>
            <span style={S.panelLabel}>Payload Intake Zone</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#999', fontWeight: 700, textTransform: 'uppercase' }}>
              {files.length} Object{files.length !== 1 ? 's' : ''} Staged
            </span>
          </div>
          <div style={S.panelBody}>
            <DragAndDrop
              files={files}
              onFilesSelected={setFiles}
              acceptedFileTypes=".pdf"
              maxFiles={toolData.operation === 'merge' ? 10 : 1}
            />
          </div>
        </div>

        {/* Configuration panel */}
        {files.length > 0 && (
          <div style={{ ...S.panel, marginTop: '24px' }}>
            <div style={S.panelHeader}>
              <span style={S.panelLabel}>Operation Configuration</span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#999', fontWeight: 700, textTransform: 'uppercase' }}>{toolData.operation}</span>
            </div>
            <div style={S.panelBody}>
              <ToolConfig
                operation={toolData.operation}
                values={config}
                onChange={setConfig}
                fileCount={files.length}
                originalSize={files[0]?.size || 0}
              />
            </div>
          </div>
        )}

        {/* Action bar */}
        {files.length > 0 && (
          <div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px', borderTop: '1px solid rgba(255,215,0,0.12)', paddingTop: '40px' }}>
            <div>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, display: 'block', marginBottom: '6px', opacity: 0.8 }}>
                System Readiness
              </span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
                {isProcessing ? 'Status: PROCESSING_BYTES...' : 'Status: AWAITING_COMMAND'}
              </span>
            </div>

            <button
              onClick={handleExecute}
              disabled={isProcessing}
              style={{
                padding: '18px 56px',
                fontFamily: 'Space Mono, monospace',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                border: 'none',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                background: isProcessing ? 'rgba(255,215,0,0.2)' : 'linear-gradient(135deg,#FFD700 0%,#FFA500 100%)',
                color: isProcessing ? '#888' : '#000',
                transition: 'all 0.3s ease',
                opacity: isProcessing ? 0.5 : 1
              }}
              onMouseEnter={e => { if (!isProcessing) { e.currentTarget.style.transform = 'translateY(-2px)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {isProcessing ? 'Executing...' : 'Execute Protocol →'}
            </button>
          </div>
        )}

        {/* Status messages */}
        {status === 'done' && (
          <div style={{ marginTop: '24px', padding: '20px 28px', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              ✓ Operation Successful // Payload Dispatched to Download
            </span>
          </div>
        )}
        {status === 'error' && (
          <div style={{ marginTop: '24px', padding: '20px 28px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#f87171', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              ✗ Failure: {errorMsg || 'Operation Aborted'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ToolWorkspace;
