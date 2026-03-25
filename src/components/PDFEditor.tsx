import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as pdfjs from 'pdfjs-dist';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import { downloadBlob } from '../utils/utils';

// Setup worker
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// ---- Types ----
type ToolMode = 'draw' | 'highlight' | 'text' | 'erase';

interface StrokePoint { x: number; y: number }
interface StrokeAnnotation {
  id: string;
  type: 'stroke';
  mode: ToolMode;
  points: StrokePoint[];
  color: string;
  width: number;
  opacity: number;
}
interface TextAnnotation {
  id: string;
  type: 'text';
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
}
type Annotation = StrokeAnnotation | TextAnnotation;

const SCALE = 1.5;
const COLORS = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ffffff'];
const HIGHLIGHT_COLORS = ['#fde047', '#86efac', '#93c5fd', '#f9a8d4', '#fdba74'];

// ---- Utilities ----
function uid() {
  return Math.random().toString(36).slice(2);
}

function canvasPointFromEvent(
  e: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): StrokePoint {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height),
  };
}

interface PDFEditorProps {
  file: File;
  onDiscard: () => void;
}

const PDFEditor: React.FC<PDFEditorProps> = ({ file, onDiscard }) => {
  // PDF state
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Tool state
  const [tool, setTool] = useState<ToolMode>('draw');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [opacity, setOpacity] = useState(1);

  // Annotations: per page
  const [annotations, setAnnotations] = useState<Record<number, Annotation[]>>({});
  const [activeText, setActiveText] = useState<{ x: number; y: number } | null>(null);
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);

  // Canvas refs
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const currentStroke = useRef<StrokePoint[]>([]);

  // Status
  const [isSaving, setIsSaving] = useState(false);

  // ---- Load PDF ----
  useEffect(() => {
    (async () => {
      const bytes = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: bytes }).promise;
      setPdfDoc(doc);
      setTotalPages(doc.numPages);
      setCurrentPage(1);
    })();
  }, [file]);

  // ---- Render current page ----
  const renderPage = useCallback(async (page: PDFPageProxy) => {
    const base = baseCanvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!base || !overlay) return;

    const viewport = page.getViewport({ scale: SCALE });
    base.width = viewport.width;
    base.height = viewport.height;
    overlay.width = viewport.width;
    overlay.height = viewport.height;

    const ctx = base.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport, canvas: base } as any).promise;
  }, []);

  useEffect(() => {
    if (!pdfDoc) return;
    (async () => {
      const page = await pdfDoc.getPage(currentPage);
      await renderPage(page);
      redrawOverlay(currentPage);
    })();
  }, [pdfDoc, currentPage, renderPage]);

  // ---- Redraw overlay from annotations ----
  const redrawOverlay = useCallback((pageNum: number) => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext('2d')!;
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const pageAnnotations = annotations[pageNum] ?? [];
    for (const ann of pageAnnotations) {
      if (ann.type === 'stroke') {
        if (ann.points.length < 2) continue;
        ctx.save();
        ctx.globalAlpha = ann.opacity;
        ctx.strokeStyle = ann.mode === 'highlight'
          ? ann.color + '99'
          : ann.color;
        ctx.lineWidth = ann.mode === 'highlight' ? ann.width * 6 : ann.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (ann.mode === 'erase') ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(ann.points[0].x, ann.points[0].y);
        for (let i = 1; i < ann.points.length; i++) {
          ctx.lineTo(ann.points[i].x, ann.points[i].y);
        }
        ctx.stroke();
        ctx.restore();
      } else if (ann.type === 'text') {
        ctx.save();
        ctx.fillStyle = ann.color;
        ctx.font = `bold ${ann.fontSize}px 'Space Mono', monospace`;
        ctx.fillText(ann.text, ann.x, ann.y);
        ctx.restore();
      }
    }
  }, [annotations]);

  useEffect(() => {
    redrawOverlay(currentPage);
  }, [annotations, currentPage, redrawOverlay]);

  // ---- Mouse drawing ----
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    if (tool === 'text') {
      const pt = canvasPointFromEvent(e, canvas);
      setActiveText(pt);
      setTextInput('');
      return;
    }

    isDrawing.current = true;
    currentStroke.current = [canvasPointFromEvent(e, canvas)];
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || tool === 'text') return;
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    const pt = canvasPointFromEvent(e, canvas);
    currentStroke.current.push(pt);

    // Live preview
    const ctx = canvas.getContext('2d')!;
    if (currentStroke.current.length >= 2) {
      const pts = currentStroke.current;
      ctx.save();
      if (tool === 'erase') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = brushSize * 8;
      } else if (tool === 'highlight') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color + '70';
        ctx.lineWidth = brushSize * 6;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
      ctx.restore();
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing.current || tool === 'text') return;
    isDrawing.current = false;
    if (currentStroke.current.length < 2) return;

    const ann: StrokeAnnotation = {
      id: uid(),
      type: 'stroke',
      mode: tool,
      points: [...currentStroke.current],
      color,
      width: brushSize,
      opacity,
    };
    setAnnotations(prev => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] ?? []), ann],
    }));
    currentStroke.current = [];
  };

  const commitText = () => {
    if (!activeText || !textInput.trim()) {
      setActiveText(null);
      return;
    }
    const ann: TextAnnotation = {
      id: uid(),
      type: 'text',
      x: activeText.x,
      y: activeText.y,
      text: textInput,
      color: textColor,
      fontSize,
    };
    setAnnotations(prev => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] ?? []), ann],
    }));
    setActiveText(null);
    setTextInput('');
  };

  const undoLast = () => {
    setAnnotations(prev => {
      const pg = prev[currentPage] ?? [];
      if (pg.length === 0) return prev;
      return { ...prev, [currentPage]: pg.slice(0, -1) };
    });
  };

  const clearPage = () => {
    setAnnotations(prev => ({ ...prev, [currentPage]: [] }));
  };

  // ---- Download edited PDF ----
  const handleDownload = async () => {
    setIsSaving(true);
    try {
      const fileBytes = await file.arrayBuffer();
      const pdfLibDoc = await PDFDocument.load(fileBytes);
      const overlayCanvas = overlayCanvasRef.current;
      const baseCanvas = baseCanvasRef.current;
      if (!overlayCanvas || !baseCanvas || !pdfDoc) return;

      for (let pgNum = 1; pgNum <= totalPages; pgNum++) {
        const pageAnns = annotations[pgNum];
        if (!pageAnns || pageAnns.length === 0) continue;

        // Render the page + annotations to a temp canvas
        const page = await pdfDoc.getPage(pgNum);
        const viewport = page.getViewport({ scale: SCALE });
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = viewport.width;
        tmpCanvas.height = viewport.height;
        const tmpCtx = tmpCanvas.getContext('2d')!;

        // Draw base PDF
        await page.render({ canvasContext: tmpCtx, viewport, canvas: tmpCanvas } as any).promise;

        // Draw annotations on top
        for (const ann of pageAnns) {
          if (ann.type === 'stroke') {
            if (ann.points.length < 2) continue;
            tmpCtx.save();
            tmpCtx.globalAlpha = ann.opacity;
            tmpCtx.strokeStyle = ann.mode === 'highlight' ? ann.color + '99' : ann.color;
            tmpCtx.lineWidth = ann.mode === 'highlight' ? ann.width * 6 : ann.width;
            tmpCtx.lineCap = 'round';
            tmpCtx.lineJoin = 'round';
            if (ann.mode === 'erase') tmpCtx.globalCompositeOperation = 'destination-out';
            tmpCtx.beginPath();
            tmpCtx.moveTo(ann.points[0].x, ann.points[0].y);
            for (let i = 1; i < ann.points.length; i++) {
              tmpCtx.lineTo(ann.points[i].x, ann.points[i].y);
            }
            tmpCtx.stroke();
            tmpCtx.restore();
          } else if (ann.type === 'text') {
            tmpCtx.save();
            tmpCtx.fillStyle = ann.color;
            tmpCtx.font = `bold ${ann.fontSize}px monospace`;
            tmpCtx.fillText(ann.text, ann.x, ann.y);
            tmpCtx.restore();
          }
        }

        // Embed into pdf-lib page
        const pngDataUrl = tmpCanvas.toDataURL('image/png');
        const pngBytes = await fetch(pngDataUrl).then(r => r.arrayBuffer());
        const img = await pdfLibDoc.embedPng(pngBytes);
        const pdfPage = pdfLibDoc.getPage(pgNum - 1);
        const { width, height } = pdfPage.getSize();
        pdfPage.drawImage(img, {
          x: 0,
          y: 0,
          width,
          height,
          opacity: 1,
        });
      }

      const saved = await pdfLibDoc.save();
      downloadBlob(saved as Uint8Array, `EDITED_${Date.now()}.pdf`);
    } finally {
      setIsSaving(false);
    }
  };

  // ---- Tool colour resolution ----

  const toolButtons: { id: ToolMode; label: string; icon: string }[] = [
    { id: 'draw', label: 'Draw', icon: '✏️' },
    { id: 'highlight', label: 'Highlight', icon: '🖊' },
    { id: 'text', label: 'Text', icon: 'T' },
    { id: 'erase', label: 'Erase', icon: '⌫' },
  ];

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-64px)] bg-white">
      {/* ---- Top Bar ---- */}
      <div className="border-b border-black/[0.08] bg-gray-50/50 py-4 px-6 md:px-10 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-6">
          <button
            onClick={onDiscard}
            className="font-mono text-xs text-gray-600 hover:text-black uppercase tracking-widest transition-colors cursor-pointer font-bold flex items-center gap-2"
          >
            ← Back
          </button>
          <span className="font-mono text-[11px] text-gray-400 uppercase tracking-widest font-bold hidden md:inline">
            Visual Canvas Editor // {file.name}
          </span>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-3">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="w-8 h-8 border border-black/10 font-mono text-sm hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            ‹
          </button>
          <span className="font-mono text-xs text-black font-bold uppercase">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="w-8 h-8 border border-black/10 font-mono text-sm hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            ›
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={undoLast}
            className="font-mono text-xs uppercase tracking-widest px-5 py-2.5 border border-black/[0.08] hover:border-black transition-all cursor-pointer font-bold text-gray-600 hover:text-black"
          >
            Undo
          </button>
          <button
            onClick={clearPage}
            className="font-mono text-xs uppercase tracking-widest px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 transition-all cursor-pointer font-bold"
          >
            Clear Page
          </button>
          <button
            onClick={handleDownload}
            disabled={isSaving}
            className="font-mono text-xs uppercase tracking-widest px-8 py-2.5 bg-black text-white hover:bg-gray-800 transition-all cursor-pointer font-bold disabled:opacity-40"
          >
            {isSaving ? 'Saving...' : 'Download →'}
          </button>
        </div>
      </div>

      {/* ---- Main Layout ---- */}
      <div className="flex flex-1 overflow-hidden">
        {/* ---- Tool Palette ---- */}
        <aside className="w-56 border-r border-black/[0.08] bg-gray-50/30 flex flex-col gap-6 p-5 overflow-y-auto shrink-0">
          {/* Tools */}
          <div>
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">Tool</p>
            <div className="flex flex-col gap-2">
              {toolButtons.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTool(t.id)}
                  className={`px-4 py-3 border-2 font-mono text-xs font-bold uppercase tracking-widest text-left transition-all cursor-pointer flex items-center gap-3
                    ${tool === t.id ? 'border-black bg-black text-white' : 'border-black/[0.08] text-gray-600 hover:border-black/30'}
                  `}
                >
                  <span className="text-base">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color — shown for draw, text, highlight */}
          {tool !== 'erase' && (
            <div>
              <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">
                {tool === 'highlight' ? 'Highlight Colour' : 'Colour'}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {(tool === 'highlight' ? HIGHLIGHT_COLORS : COLORS).map(c => (
                  <button
                    key={c}
                    onClick={() => tool === 'text' ? setTextColor(c) : setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 border-2 transition-all cursor-pointer
                      ${(tool === 'text' ? textColor : color) === c ? 'border-black scale-110' : 'border-transparent hover:border-black/30'}
                    `}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Brush size — draw / erase / highlight */}
          {tool !== 'text' && (
            <div>
              <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">
                Brush: {brushSize}px
              </p>
              <input
                type="range" min={1} max={20} step={1}
                value={brushSize}
                onChange={e => setBrushSize(parseInt(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>
          )}

          {/* Text specific */}
          {tool === 'text' && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">Font Size: {fontSize}px</p>
                <input
                  type="range" min={10} max={60} step={2}
                  value={fontSize}
                  onChange={e => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Draw opacity */}
          {tool === 'draw' && (
            <div>
              <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">
                Opacity: {Math.round(opacity * 100)}%
              </p>
              <input
                type="range" min={10} max={100} step={5}
                value={opacity * 100}
                onChange={e => setOpacity(parseInt(e.target.value) / 100)}
                className="w-full accent-black cursor-pointer"
              />
            </div>
          )}

          {/* Instructions */}
          <div className="border border-black/[0.05] p-4 mt-auto">
            <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest font-bold leading-relaxed">
              {tool === 'draw' && 'Click + drag to draw freehand strokes.'}
              {tool === 'highlight' && 'Drag over text to highlight it.'}
              {tool === 'text' && 'Click anywhere to place a text node.'}
              {tool === 'erase' && 'Drag to erase annotations.'}
            </p>
          </div>
        </aside>

        {/* ---- Canvas Area ---- */}
        <div className="flex-1 overflow-auto bg-gray-100 flex items-start justify-center p-8">
          {!pdfDoc && (
            <div className="flex items-center justify-center h-full">
              <span className="font-mono text-xs text-gray-400 uppercase tracking-widest animate-pulse">
                Loading document...
              </span>
            </div>
          )}

          {pdfDoc && (
            <div className="relative shadow-2xl" style={{ display: 'inline-block' }}>
              {/* Base PDF layer */}
              <canvas
                ref={baseCanvasRef}
                className="block"
                style={{ display: 'block' }}
              />
              {/* Drawing overlay */}
              <canvas
                ref={overlayCanvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  cursor: tool === 'erase'
                    ? 'cell'
                    : tool === 'text'
                      ? 'text'
                      : 'crosshair',
                }}
              />

              {/* Text input overlay */}
              {activeText && (
                <div
                  style={{
                    position: 'absolute',
                    top: (activeText.y / (overlayCanvasRef.current?.height ?? 1)) * (overlayCanvasRef.current?.getBoundingClientRect().height ?? 0),
                    left: (activeText.x / (overlayCanvasRef.current?.width ?? 1)) * (overlayCanvasRef.current?.getBoundingClientRect().width ?? 0),
                    zIndex: 10,
                  }}
                >
                  <input
                    autoFocus
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitText();
                      if (e.key === 'Escape') setActiveText(null);
                    }}
                    onBlur={commitText}
                    style={{
                      fontSize: `${fontSize}px`,
                      color: textColor,
                      background: 'rgba(255,255,255,0.85)',
                      border: '2px solid black',
                      outline: 'none',
                      padding: '2px 6px',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      minWidth: 120,
                    }}
                    placeholder="Type here, Enter to place"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFEditor;
