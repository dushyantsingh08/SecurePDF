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

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (newFilesList: FileList | null) => {
    if (!newFilesList) return;
    const newFiles = Array.from(newFilesList);
    const totalFiles = [...files, ...newFiles].slice(0, maxFiles);
    onFilesSelected(totalFiles);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;
    
    const updatedFiles = [...files];
    const temp = updatedFiles[index];
    updatedFiles[index] = updatedFiles[newIndex];
    updatedFiles[newIndex] = temp;
    
    onFilesSelected(updatedFiles);
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    onFilesSelected(updatedFiles);
  };

  return (
    <div className="w-full font-sans">
      {/* Upload zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center py-24 md:py-32 px-10 text-center crosshair overflow-hidden
          ${isDragging ? 'border-black bg-gray-50' : 'border-black/20 hover:border-black/30 hover:bg-gray-50/50'}
        `}
      >
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          multiple={maxFiles > 1}
          accept={acceptedFileTypes}
        />

        {/* Icon placeholder */}
        <div className="relative z-10 w-12 h-16 border-2 border-black/10 mb-8 flex items-center justify-center bg-white shadow-md">
          <span className="font-mono text-xs text-black/30 font-bold">PDF</span>
        </div>

        <h3 className="relative z-10 font-sans text-xl md:text-2xl font-bold text-black uppercase tracking-tight mb-3">
          Initialize Payload
        </h3>
        <p className="relative z-10 font-mono text-xs text-gray-400 uppercase tracking-[0.3em] mb-12 font-bold">
          Source: Local Intake // Intake Limit: {maxFiles}
        </p>

        <button className="relative z-10 bg-black text-white font-mono text-xs uppercase tracking-[0.2em] px-12 py-4 hover:bg-gray-800 transition-all pointer-events-none font-bold shadow-lg">
          SELECT FILES →
        </button>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-10 border-t-2 border-black/10 pt-10">
          <span className="font-mono text-[11px] text-gray-500 uppercase tracking-[0.4em] mb-6 block font-bold">
            Queue Status: {files.length} Object{files.length > 1 ? 's' : ''} Detected
          </span>
          <ul className="border-2 border-black/[0.05]">
            {files.map((file: File, index: number) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between px-8 py-5 border-b-2 border-black/[0.05] last:border-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-5 overflow-hidden flex-1">
                  <span className="font-mono text-[11px] text-gray-400 font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  
                  {/* Reorder Controls */}
                  {maxFiles > 1 && (
                    <div className="flex flex-col gap-1 mr-2">
                       <button 
                         disabled={index === 0}
                         onClick={(e) => { e.stopPropagation(); moveFile(index, 'up'); }}
                         className="font-mono text-[10px] text-gray-400 hover:text-black disabled:opacity-0 disabled:cursor-default cursor-pointer leading-none px-1"
                       >
                         ▲
                       </button>
                       <button 
                         disabled={index === files.length - 1}
                         onClick={(e) => { e.stopPropagation(); moveFile(index, 'down'); }}
                         className="font-mono text-[10px] text-gray-400 hover:text-black disabled:opacity-0 disabled:cursor-default cursor-pointer leading-none px-1"
                       >
                         ▼
                       </button>
                    </div>
                  )}

                  <span className="font-mono text-sm text-black font-bold truncate uppercase tracking-tight">
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="font-mono text-[11px] text-gray-400 hover:text-red-600 border border-transparent hover:border-red-600 px-4 py-2 transition-all cursor-pointer font-bold"
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