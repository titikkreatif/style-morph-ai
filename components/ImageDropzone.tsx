
import React, { useRef, useState } from 'react';

interface ImageDropzoneProps {
  onImageSelect: (base64: string, file: File) => void;
  label: string;
  previewUrl?: string;
  description?: string;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageSelect, label, previewUrl, description }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      onImageSelect(base64, file);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div 
      className={`relative group cursor-pointer transition-all border-2 border-dashed rounded-xl overflow-hidden aspect-[3/4] flex flex-col items-center justify-center p-4 text-center
        ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'}
        ${previewUrl ? 'border-none' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      {previewUrl ? (
        <>
          <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-white font-medium bg-black/60 px-4 py-2 rounded-full text-sm">Change Image</p>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-slate-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">{label}</p>
            <p className="text-xs text-slate-400 mt-1">{description || "Drag & drop or click"}</p>
          </div>
        </div>
      )}
    </div>
  );
};
