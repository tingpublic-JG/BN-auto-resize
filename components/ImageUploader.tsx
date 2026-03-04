import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, selectedImage }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`relative w-full border-2 border-dashed rounded-xl p-8 transition-all duration-300 text-center flex flex-col items-center justify-center h-64
        ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
      
      {selectedImage ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <img 
            src={URL.createObjectURL(selectedImage)} 
            alt="Preview" 
            className="max-h-48 rounded-lg shadow-lg object-contain mb-4"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300 truncate max-w-[200px]">{selectedImage.name}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick();
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="w-12 h-12 mb-4 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-1">Upload Source Image</h3>
          <p className="text-slate-400 text-sm mb-4">Drag & drop or click to browse</p>
          <button 
            type="button" 
            onClick={onButtonClick}
            className="px-4 py-2 text-sm font-medium text-indigo-100 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/50 rounded-lg transition-colors"
          >
            Select File
          </button>
        </>
      )}
    </div>
  );
};