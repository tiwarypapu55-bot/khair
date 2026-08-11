import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, X, ExternalLink, FileCheck, Check, UploadCloud, AlertCircle } from 'lucide-react';

interface FileUploadInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  acceptTypes?: string; // e.g. "image/*,.pdf,.doc,.docx"
  placeholder?: string;
  helpText?: string;
  allowPdf?: boolean;
  required?: boolean;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  value,
  onChange,
  label = 'Upload Photo or Document (JPG, PNG, PDF)',
  acceptTypes = 'image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.webp',
  placeholder = 'https://... or choose a file',
  helpText = 'Supports JPG, PNG, WEBP images and PDF documents up to 10MB.',
  allowPdf = true,
  required = false
}) => {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | 'other' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect file type from value or state
  const isDataPdf = value?.startsWith('data:application/pdf');
  const isUrlPdf = value?.toLowerCase().includes('.pdf');
  const isPdf = isDataPdf || isUrlPdf || fileType === 'pdf';

  const isDataImage = value?.startsWith('data:image/');
  const isUrlImage = value?.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || value?.includes('images.unsplash.com') || value?.includes('photo-');
  const isImage = isDataImage || isUrlImage || fileType === 'image' || (!isPdf && value?.length > 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);

    // Max 12MB limit for client side storage
    if (file.size > 12 * 1024 * 1024) {
      setErrorMsg('File size exceeds 12MB limit. Please select a smaller file or compressed image.');
      return;
    }

    const formattedSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    setFileName(file.name);
    setFileSize(formattedSize);

    if (file.type.includes('pdf')) {
      setFileType('pdf');
    } else if (file.type.includes('image')) {
      setFileType('image');
    } else {
      setFileType('other');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawResult = event.target?.result as string;
      if (!rawResult) return;

      if (file.type.includes('image')) {
        // Compress image using HTML Canvas to prevent localStorage quota issues
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedResult = canvas.toDataURL('image/jpeg', 0.82);
            onChange(compressedResult);
          } else {
            onChange(rawResult);
          }
        };
        img.onerror = () => onChange(rawResult);
        img.src = rawResult;
      } else {
        onChange(rawResult);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearFile = () => {
    onChange('');
    setFileName(null);
    setFileSize(null);
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        
        {/* Toggle between File Upload and URL input */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-xs transition cursor-pointer ${
              inputMode === 'upload' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-xs transition cursor-pointer ${
              inputMode === 'url' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Image / Doc URL
          </button>
        </div>
      </div>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Mode 1: File Upload Drag & Dropzone */}
      {inputMode === 'upload' && (
        <div>
          {!value ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center transition cursor-pointer ${
                isDragging
                  ? 'border-emerald-600 bg-emerald-50/70'
                  : 'border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/30'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-1.5 py-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drag & drop file
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    JPG, PNG, WEBP photo or PDF document
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                {/* Thumbnail Preview or PDF icon */}
                {isPdf ? (
                  <div className="w-12 h-12 rounded-lg bg-rose-100 text-rose-700 flex flex-col items-center justify-center shrink-0 border border-rose-200">
                    <FileText className="w-6 h-6" />
                    <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">PDF</span>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-300 relative group">
                    <img src={value} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="truncate text-xs">
                  <p className="font-bold text-slate-900 truncate">
                    {fileName || (isPdf ? 'PDF Document Uploaded' : 'Photo File Uploaded')}
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                    {fileSize && <span>{fileSize}</span>}
                    <span className="text-emerald-700 font-bold uppercase">{isPdf ? 'PDF Document' : 'Image'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md transition cursor-pointer"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={clearFile}
                  className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-md transition cursor-pointer"
                  title="Remove File"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Direct URL Input */}
      {inputMode === 'url' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-mono"
            />
            {value && (
              <button
                type="button"
                onClick={clearFile}
                className="p-2 text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl cursor-pointer"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {value && (
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2 text-xs">
              {isPdf ? (
                <div className="flex items-center gap-2 text-rose-700 font-bold">
                  <FileText className="w-4 h-4" />
                  <span>PDF Document linked</span>
                  <a href={value} target="_blank" rel="noopener noreferrer" className="ml-auto text-[11px] underline flex items-center gap-0.5 text-blue-600">
                    Open <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <img src={value} alt="Preview" className="w-8 h-8 rounded-md object-cover border border-slate-300" />
                  <span className="text-[11px] text-slate-600">Image preview verified</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Help text */}
      <p className="text-[11px] text-slate-400">
        {helpText}
      </p>
    </div>
  );
};
