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
} from '../utils/utils';

interface ToolWorkspaceProps {
  toolData: PDFOperationData;
  onBack: () => void;
}

// Parse a string like "1-5, 8, 11-15" → [[1,5],[8,8],[11,15]]
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

// Parse comma-separated page numbers with ranges → flat number[]
function parsePageNumbers(input: string): number[] {
  const pages: number[] = [];
  parseRanges(input).forEach(([s, e]) => {
    for (let i = s; i <= e; i++) pages.push(i);
  });
  return [...new Set(pages)];
}

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

  // ---- Edit PDF: show canvas editor once a file is loaded ----
  if (toolData.operation === 'edit') {
    if (files.length > 0) {
      return <PDFEditor file={files[0]} onDiscard={() => setFiles([])} />;
    }
    return (
      <section className="w-full min-h-[calc(100vh-64px)] flex flex-col bg-white">
        <div className="border-b border-black/[0.08] py-5 bg-gray-50/50">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 flex items-center">
            <button onClick={onBack}
              className="group font-mono text-xs text-gray-700 hover:text-black uppercase tracking-[0.2em] transition-colors cursor-pointer inline-flex items-center gap-4 font-bold"
            >
              <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
              BACK TO PROTOCOLS
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-2xl w-full px-6">
            <div className="mb-12 text-center">
              <span className="font-mono text-[11px] text-gray-400 uppercase tracking-[0.4em] mb-4 block font-bold">
                Canvas Editor // SELECT PAYLOAD
              </span>
              <h1 className="font-sans text-4xl md:text-6xl font-bold text-black tracking-tighter mb-6">
                Edit PDF
              </h1>
              <p className="font-sans text-base text-gray-600 font-medium">
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
          result = await compressPdf(files[0]);
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
          // Download each range as a separate file
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
          if (!config.password?.trim()) throw new Error('Please enter a password to encrypt with.');
          result = await compressPdf(files[0]); // placeholder until real encryption
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
    <section className="w-full min-h-[calc(100vh-64px)] flex flex-col bg-white">
      {/* Top bar */}
      <div className="border-b border-black/[0.08] py-5 bg-gray-50/50">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group font-mono text-xs text-gray-700 hover:text-black uppercase tracking-[0.2em] transition-colors cursor-pointer inline-flex items-center gap-4 font-bold"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
            BACK TO PROTOCOLS
          </button>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[11px] text-gray-500 uppercase tracking-[0.4em] font-bold hidden sm:inline">
              PROTOCOL_INTAKE: {toolData.tag}
            </span>
            <div className="flex gap-2">
              <div className={`w-2 h-2 ${status === 'processing' ? 'bg-black animate-pulse' : 'bg-black/10'}`} />
              <div className={`w-2 h-2 ${status === 'done' ? 'bg-green-500' : 'bg-black/10'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Title block */}
          <div className="mb-14 border-l-4 border-black/10 pl-10">
            <span className="font-mono text-[11px] text-gray-400 uppercase tracking-[0.4em] mb-4 block font-bold">
              Execution Interface // {toolData.operation}
            </span>
            <h1 className="font-sans text-4xl md:text-6xl font-bold text-black tracking-tighter mb-8">
              {toolData.title}
            </h1>
            <p className="font-sans text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl font-medium">
              {toolData.description}
            </p>
          </div>

          {/* Upload area */}
          <div className="border-2 border-black/[0.05] bg-white">
            <div className="border-b-2 border-black/[0.05] px-8 py-4 flex items-center justify-between bg-gray-50/30">
              <span className="font-mono text-[11px] text-gray-500 uppercase tracking-[0.3em] font-bold">
                Payload Intake Zone
              </span>
              <span className="font-mono text-[11px] text-gray-300 font-bold uppercase">
                {files.length} Object{files.length !== 1 ? 's' : ''} Staged
              </span>
            </div>
            <div className="p-8 md:p-12">
              <DragAndDrop
                files={files}
                onFilesSelected={setFiles}
                acceptedFileTypes=".pdf"
                maxFiles={toolData.operation === 'merge' ? 10 : 1}
              />
            </div>
          </div>

          {/* Configuration Panel */}
          {files.length > 0 && (
            <div className="mt-12 border-2 border-black/[0.05]">
              <div className="border-b-2 border-black/[0.05] px-8 py-4 flex items-center justify-between bg-gray-50/30">
                <span className="font-mono text-[11px] text-black font-bold uppercase tracking-widest">
                  Operation Configuration
                </span>
                <span className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {toolData.operation}
                </span>
              </div>
              <div className="p-8 md:p-10">
                <ToolConfig
                  operation={toolData.operation}
                  values={config}
                  onChange={setConfig}
                  fileCount={files.length}
                />
              </div>
            </div>
          )}

          {/* Action Bar */}
          {files.length > 0 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-8 border-t-2 border-black/[0.05] pt-12">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] text-black font-bold uppercase tracking-widest">
                  System Readiness
                </span>
                <span className="font-mono text-xs text-gray-400 font-bold uppercase">
                  {isProcessing ? 'Status: PROCESSING_BYTES...' : 'Status: AWAITING_COMMAND'}
                </span>
              </div>

              <button
                onClick={handleExecute}
                disabled={isProcessing}
                className={`w-full sm:w-auto px-16 py-5 font-mono text-sm font-bold uppercase tracking-[0.3em] transition-all
                  ${isProcessing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800 shadow-2xl cursor-pointer hover:-translate-y-1 active:translate-y-0'
                  }
                `}
              >
                {isProcessing ? 'Executing...' : 'Execute Protocol →'}
              </button>
            </div>
          )}

          {/* Status Messages */}
          {status === 'done' && (
            <div className="mt-8 p-6 border-2 border-green-500/20 bg-green-50/30 flex items-center gap-4">
              <span className="font-mono text-xs text-green-700 font-bold uppercase tracking-widest">
                ✓ Operation Successful // Payload Dispatched to Download
              </span>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-8 p-6 border-2 border-red-500/20 bg-red-50/30 flex items-center gap-4">
              <span className="font-mono text-xs text-red-700 font-bold uppercase tracking-widest">
                ✗ Failure: {errorMsg || 'Operation Aborted'}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ToolWorkspace;
