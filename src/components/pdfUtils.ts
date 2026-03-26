// @ts-nocheck
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Configure PDF.js worker
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Load PDF and extract pages with text positions
 */
export const loadPDFFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  // IMPORTANT: PDF.js transfers the buffer to the worker, detaching it.
  // We MUST slice it to keep a valid copy for the export step later.
  const bufferForExport = arrayBuffer.slice(0);
  
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pages = [];
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    
    // Render page to canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    // Get page image
    const imageData = canvas.toDataURL('image/png');
    
    // Extract text content with positions
    const textContent = await page.getTextContent();
    const textElements = extractTextElements(textContent, viewport);
    
    pages.push({
      id: pageNum - 1,
      width: viewport.width / 2,
      height: viewport.height / 2,
      imageData,
      textElements,
      originalViewport: viewport
    });
  }
  
  return { pages, originalFile: bufferForExport };
};

// Extract text elements with proper positioning
const extractTextElements = (textContent, viewport) => {
  const elements = [];
  let elementId = 0;
  
  // viewport.height is scaled. the original unscaled height is viewport.height / 2
  const unscaledHeight = viewport.height / 2;

  textContent.items.forEach((item) => {
    // Transform coordinates from PDF space to screen space
    const tx = item.transform;
    const x = tx[4];
    const y = unscaledHeight - tx[5];
    const fontSize = Math.abs(tx[3]);
    const width = item.width;
    
    // Skip empty strings
    if (!item.str.trim()) return;
    
    elements.push({
      id: `text-${elementId++}`,
      text: item.str,
      originalText: item.str,
      x,
      y: y - fontSize, // Adjust y to top-left corner
      fontSize,
      fontFamily: getFontFamily(item.fontName),
      fontWeight: getFontWeight(item.fontName),
      color: '#000000',
      width: Math.max(width, 50),
      height: fontSize * 1.2,
      align: 'left',
      originalFontName: item.fontName,
      transform: tx
    });
  });
  
  return elements;
};

/**
 * Map PDF font names to web-safe fonts
 */
const getFontFamily = (fontName) => {
  if (!fontName) return 'Georgia, serif';
  
  const name = fontName.toLowerCase();
  
  if (name.includes('times') || name.includes('serif')) {
    return 'Georgia, "Times New Roman", serif';
  } else if (name.includes('helvetica') || name.includes('arial')) {
    return '"Segoe UI", Arial, sans-serif';
  } else if (name.includes('courier') || name.includes('mono')) {
    return '"Courier New", monospace';
  }
  
  return 'Georgia, serif';
};

/**
 * Determine font weight from font name
 */
const getFontWeight = (fontName) => {
  if (!fontName) return 'normal';
  
  const name = fontName.toLowerCase();
  
  if (name.includes('bold')) {
    return 'bold';
  } else if (name.includes('light')) {
    return '300';
  }
  
  return 'normal';
};

/**
 * Export modified PDF with text changes
 */
export const exportModifiedPDF = async (originalFileBuffer, pages, modifications) => {
  try {
    // Rebuild the PDF into a clean new document to avoid structural issues
    const originalPdfDoc = await PDFDocument.load(originalFileBuffer, { ignoreEncryption: true });
    const pdfDoc = await PDFDocument.create();
    const copiedPages = await pdfDoc.copyPages(originalPdfDoc, originalPdfDoc.getPageIndices());
    copiedPages.forEach(p => pdfDoc.addPage(p));
    
    const pdfPages = pdfDoc.getPages();
    
    // Embed standard fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Apply modifications to each page
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const page = pdfPages[pageIndex];
      const { height } = page.getSize();
      const mods = modifications[pageIndex] || [];
      
      // Process each text modification
      for (const mod of mods) {
        try {
          // Sanitize values
          const curX = Number(mod.x) || 0;
          const curY = Number(mod.y) || 0;
          const curFontSize = Number(mod.fontSize) || 12;
          const curWidth = Number(mod.width) || 50;
          
          // ALWAYS cover the original area if it was modified or deleted
          if (mod.deleted || mod.text !== mod.originalText || (mod.oldX !== undefined && Math.abs(curX - mod.oldX) > 0.1) || (mod.oldY !== undefined && Math.abs(curY - mod.oldY) > 0.1)) {
            // Cover the area where the original text was
            const whiteX = mod.deleted ? curX : mod.oldX;
            const whiteY = mod.deleted ? curY : (mod.oldY ?? curY);
            
            if (mod.originalText && whiteX !== undefined && whiteY !== undefined) {
              const rHeight = curFontSize * 1.2;
               page.drawRectangle({
                x: Number(whiteX),
                y: height - Number(whiteY) - curFontSize,
                width: Number(mod.width) || 20,
                height: rHeight,
                color: rgb(1, 1, 1),
                borderWidth: 0
              });
            }
          }
          
          if (!mod.deleted && mod.text) {
            // Draw the text (either modified or just moved)
            const color = hexToRgb(mod.color || '#000000');
            const font = mod.fontWeight === 'bold' ? helveticaBoldFont : helveticaFont;
            
            // Limit string to avoid encoding errors for weird PDFs
            const safeText = String(mod.text).replace(/[^\x20-\x7E]/g, '?');
            
            page.drawText(safeText, {
              x: curX,
              y: height - curY - curFontSize,
              size: curFontSize,
              font: font,
              color: rgb(color.r / 255, color.g / 255, color.b / 255),
            });
          }
        } catch (innerErr) {
          console.warn('Skipping modification due to error:', innerErr);
        }
      }
    }
    
    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

/**
 * Convert hex color to RGB
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

/**
 * Create modifications data structure for export
 */
export const createModifications = (originalPages, modifiedTextElements) => {
  const modifications = {};
  
  Object.keys(modifiedTextElements).forEach(pageIndex => {
    const original = originalPages[pageIndex]?.textElements || [];
    const modified = modifiedTextElements[pageIndex] || [];
    
    const pageMods = [];
    
    // Find deleted elements
    original.forEach(origEl => {
      const stillExists = modified.find(modEl => modEl.id === origEl.id);
      if (!stillExists) {
        pageMods.push({ ...origEl, deleted: true });
      }
    });
    
    // Find modified or new elements
    modified.forEach(modEl => {
      const origEl = original.find(o => o.id === modEl.id);
      
      if (!origEl) {
        // New element
        pageMods.push({ ...modEl, originalText: '', new: true });
      } else if (
        modEl.text !== origEl.text ||
        Math.abs(modEl.x - origEl.x) > 0.1 ||
        Math.abs(modEl.y - origEl.y) > 0.1 ||
        modEl.fontSize !== origEl.fontSize ||
        modEl.color !== origEl.color
      ) {
        // Modified element - keep track of old position for whiting out
        pageMods.push({ 
          ...modEl, 
          originalText: origEl.text,
          oldX: origEl.x,
          oldY: origEl.y
        });
      }
    });
    
    if (pageMods.length > 0) {
      modifications[pageIndex] = pageMods;
    }
  });
  
  return modifications;
};
