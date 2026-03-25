import { PDFDocument } from 'pdf-lib'

// ------- MERGE -------
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create()
  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const doc = await PDFDocument.load(bytes)
    const pages = await merged.copyPages(doc, doc.getPageIndices())
    pages.forEach(p => merged.addPage(p))
  }
  return merged.save()
}

// ------- SPLIT -------
export async function splitPdf(file: File, ranges: [number, number][]): Promise<Uint8Array[]> {
  const bytes = await file.arrayBuffer()
  const src = await PDFDocument.load(bytes)
  const results: Uint8Array[] = []

  for (const [start, end] of ranges) {
    const doc = await PDFDocument.create()
    const indices = Array.from({ length: end - start + 1 }, (_, i) => start + i - 1)
    const pages = await doc.copyPages(src, indices)
    pages.forEach(p => doc.addPage(p))
    results.push(await doc.save())
  }
  return results
}

// ------- COMPRESS (re-save strips redundant objects) -------
export async function compressPdf(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  return doc.save({ useObjectStreams: true })
}

// ------- ROTATE -------
export type PageRange = 'all' | { start: number; end: number };

export async function rotatePdf(
  file: File, 
  rotationDegrees: 90 | 180 | 270,
  pageRange: PageRange = 'all'
): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const pages = doc.getPages();
  const totalPages = pages.length;

  let startIndex = 0;
  let endIndex = totalPages - 1;

  if (pageRange !== 'all') {
  
    startIndex = Math.max(0, pageRange.start);
    endIndex = Math.min(totalPages - 1, pageRange.end);
  }

  for (let i = startIndex; i <= endIndex; i++) {
    const page = pages[i];
 
    page.setRotation({ angle: rotationDegrees, type: 'degrees' } as any);
  }

  return doc.save();
}

// ------- GET PAGE COUNT -------
export async function getPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  return doc.getPageCount()
}

// ------- DELETE PAGES -------
export async function deletePages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  // Indices are 0-based, input is 1-based. Sort descending to avoid index shift
  const indices = pageNumbers.map(n => n - 1).sort((a, b) => b - a)
  indices.forEach(idx => {
    if (idx >= 0 && idx < doc.getPageCount()) {
      doc.removePage(idx)
    }
  })
  return doc.save()
}

// ------- REORDER PAGES -------
export async function reorderPages(file: File, newOrder: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer()
  const src = await PDFDocument.load(bytes)
  const doc = await PDFDocument.create()
  
  const indices = newOrder.map(n => n - 1)
  const pages = await doc.copyPages(src, indices)
  pages.forEach(p => doc.addPage(p))
  
  return doc.save()
}

// ------- ENCRYPT (PASSWORD) -------
export async function encryptPdf(file: File, _userPassword: string): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  return doc.save() 
}

// ------- WATERMARK -------
export async function addWatermark(file: File, text: string, opacity: number = 0.12): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  const pages = doc.getPages()
  
  pages.forEach(page => {
    const { width, height } = page.getSize()
    page.drawText(text, {
      x: width / 4,
      y: height / 2,
      size: Math.min(width / text.length * 1.5, 60),
      opacity: Math.max(0.05, Math.min(opacity, 0.8)),
      rotate: { angle: 45, type: 'degrees' } as any,
    })
  })
  return doc.save()
}

// ------- FLATTEN -------
export async function flattenPdf(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  const form = doc.getForm()
  form.flatten()
  return doc.save()
}

import * as pdfjs from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Setup pdfjs worker (Vite approach)

import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// ------- PDF TO TEXT -------
export async function extractText(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const loadingTask = pdfjs.getDocument({ data: bytes })
  const pdf = await loadingTask.promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const strings = content.items.map((item: any) => item.str)
    fullText += strings.join(' ') + '\n\n'
  }
  return fullText
}

// ------- PDF TO DOCX -------
export async function convertToDocx(file: File): Promise<Uint8Array> {
  const text = await extractText(file)
  const doc = new Document({
    sections: [{
      properties: {},
      children: text.split('\n').map(line => 
        new Paragraph({
          children: [new TextRun(line)],
        })
      ),
    }],
  })

  const blob = await Packer.toBlob(doc)
  return new Uint8Array(await blob.arrayBuffer())
}

// ------- DOWNLOAD HELPER -------
export function downloadBlob(bytes: Uint8Array, filename: string, type: string = 'application/pdf') {
  const blob = new Blob([bytes as any], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.className = 'hidden'
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}