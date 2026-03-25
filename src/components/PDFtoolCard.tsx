import React from 'react';

export type PDFActionType = 
  | 'merge' | 'split' | 'compress' | 'protect' | 'unlock' 
  | 'rotate' | 'delete' | 'reorder' | 'watermark' | 'repair' 
  | 'flatten' | 'pdf-to-jpg' | 'pdf-to-png' | 'pdf-to-docx' 
  | 'pdf-to-xlsx' | 'pdf-to-txt' | 'edit';

export interface PDFOperationData {
  id: string;
  operation: PDFActionType;
  title: string;
  description: string;
  tag: string;
  isPopular?: boolean;
}

interface PDFCardProps {
  data: PDFOperationData;
  index?: number;
  onClick: (operation: PDFActionType) => void;
}

const PDFCard: React.FC<PDFCardProps> = ({ data, index = 0, onClick }) => {
  return (
    <div
      onClick={() => onClick(data.operation)}
      className="relative group border-none bg-white transition-all cursor-pointer flex flex-col p-10 md:p-12 crosshair overflow-hidden hover:bg-gray-50 h-full"
    >
      {/* Dot grid bg on hover */}
      <div className="absolute inset-0 dot-grid opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Index */}
      <div className="relative z-10 flex items-start justify-between mb-12">
        <span className="font-mono text-4xl md:text-5xl font-bold text-black/[0.05] group-hover:text-black/[0.1] transition-colors leading-none">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-mono text-[11px] text-gray-800 group-hover:text-black uppercase tracking-[0.3em] transition-colors border-b-2 border-black/10 pb-2 font-bold">
          {data.tag}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="font-sans text-xl md:text-2xl font-bold text-black uppercase tracking-tight mb-4 transition-colors">
          {data.title}
        </h3>
        <p className="font-sans text-[15px] text-gray-500 group-hover:text-gray-700 leading-relaxed mb-10 flex-1 transition-colors font-medium">
          {data.description}
        </p>

        {/* Action line */}
        <div className="flex items-center justify-between mt-auto pt-8 border-t-2 border-black/[0.03] transition-colors">
          <span className="font-mono text-[11px] text-gray-800 group-hover:text-black uppercase tracking-widest transition-colors font-bold">
            Execute Protocol →
          </span>
          <div className="w-2.5 h-2.5 bg-black/[0.1] group-hover:bg-black transition-all" />
        </div>
      </div>
    </div>
  );
};

export default PDFCard;