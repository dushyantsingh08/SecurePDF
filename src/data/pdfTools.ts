import { type PDFActionType } from '../components/PDFtoolCard';

export interface PDFOperationData {
  id: string;
  operation: PDFActionType;
  title: string;
  description: string;
  tag: string;
  category: 'editing' | 'security' | 'optimization' | 'conversion';
  isPopular?: boolean;
}

export const pdfTools: PDFOperationData[] = [
  // --- EDITING ---
  {
    id: 'edit',
    operation: 'edit',
    title: 'Edit PDF',
    description: 'Open the visual canvas editor. Draw, highlight, annotate text, and export the modified document.',
    tag: 'EDITOR',
    category: 'editing',
    isPopular: true,
  },
  {
    id: 'merge',
    operation: 'merge',
    title: 'Merge PDF',
    description: 'Combine multiple isolated PDF structures into a single unified document output.',
    tag: 'CORE',
    category: 'editing',
    isPopular: true,
  },
  {
    id: 'split',
    operation: 'split',
    title: 'Split PDF',
    description: 'Extract discrete page ranges from an origin document into separate files.',
    tag: 'UTILITY',
    category: 'editing',
    isPopular: true,
  },
  {
    id: 'rotate',
    operation: 'rotate',
    title: 'Rotate Pages',
    description: 'Align document orientation by rotating pages 90, 180, or 270 degrees.',
    tag: 'ADJUST',
    category: 'editing',
  },
  {
    id: 'delete',
    operation: 'delete',
    title: 'Delete Pages',
    description: 'Remove redundant or sensitive pages from the document architecture.',
    tag: 'EXTRACT',
    category: 'editing',
  },
  {
    id: 'reorder',
    operation: 'reorder',
    title: 'Reorder',
    description: 'Rearrange page sequences to match required structural logic.',
    tag: 'GRID',
    category: 'editing',
  },

  // --- SECURITY ---
  {
    id: 'protect',
    operation: 'protect',
    title: 'Encrypt PDF',
    description: 'Apply AES-256 encryption with password-based authentication barriers.',
    tag: 'SECURITY',
    category: 'security',
    isPopular: true,
  },
  {
    id: 'unlock',
    operation: 'unlock',
    title: 'Unlock PDF',
    description: 'Remove security restrictions from documents (Known password required).',
    tag: 'ACCESS',
    category: 'security',
  },
  {
    id: 'watermark',
    operation: 'watermark',
    title: 'Watermark',
    description: 'Overlay strategic text markers to prevent unauthorized distribution.',
    tag: 'BRAND',
    category: 'security',
  },

  // --- OPTIMIZATION ---
  {
    id: 'compress',
    operation: 'compress',
    title: 'Compress',
    description: 'Reduce byte footprint while preserving structural data integrity.',
    tag: 'OPTIMIZE',
    category: 'optimization',
    isPopular: true,
  },
  {
    id: 'repair',
    operation: 'repair',
    title: 'Repair Metadata',
    description: 'Strip corrupted metadata and rebuild document cross-references.',
    tag: 'FIX',
    category: 'optimization',
  },
  {
    id: 'flatten',
    operation: 'flatten',
    title: 'Flatten PDF',
    description: 'Convert interactive form fields into non-editable static layer structures.',
    tag: 'STATIC',
    category: 'optimization',
  },

  // --- CONVERSION ---
  {
    id: 'pdf-to-jpg',
    operation: 'pdf-to-jpg',
    title: 'PDF to JPEG',
    description: 'Render document frames as high-fidelity JPEG raster images.',
    tag: 'IMAGE',
    category: 'conversion',
    isPopular: true,
  },
  {
    id: 'pdf-to-png',
    operation: 'pdf-to-png',
    title: 'PDF to PNG',
    description: 'Extract pages as lossless PNG files with alpha channel support.',
    tag: 'IMAGE',
    category: 'conversion',
  },
  {
    id: 'pdf-to-docx',
    operation: 'pdf-to-docx',
    title: 'PDF to DOCX',
    description: 'Translate document contents into editable Microsoft Word structures.',
    tag: 'OFFICE',
    category: 'conversion',
    isPopular: true,
  },
  {
    id: 'pdf-to-xlsx',
    operation: 'pdf-to-xlsx',
    title: 'PDF to XLSX',
    description: 'Extract tabular data layouts into structural Excel spreadsheets.',
    tag: 'DATA',
    category: 'conversion',
  },
  {
    id: 'pdf-to-txt',
    operation: 'pdf-to-txt',
    title: 'PDF to Text',
    description: 'Strip formatting and extract raw ASCII/UTF-8 coordinate text data.',
    tag: 'TEXT',
    category: 'conversion',
  },
];
