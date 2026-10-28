import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, RefreshCw, AlertCircle } from 'lucide-react';
import { useWish } from '../../context/WishContext';

interface PhotoUploaderProps {
  currentPhotoUrl?: string;
  onPhotoSelected: (url: string) => void;
  onPhotoRemoved: () => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  currentPhotoUrl,
  onPhotoSelected,
  onPhotoRemoved,
}) => {
  const { uploadPhoto } = useWish();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (objectUrlRef.current && objectUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, WEBP, or GIF).');
      return;
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    setIsUploading(true);

    try {
      // Upload permanently via backend
      const permanentUrl = await uploadPhoto(file);
      onPhotoSelected(permanentUrl);
    } catch {
      // Local fallback
      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;
      onPhotoSelected(objectUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const samplePhotos = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />

      {currentPhotoUrl ? (
        /* Image Preview with Replace and Remove controls */
        <div className="relative rounded-2xl overflow-hidden border border-plum-200 bg-white p-3 flex flex-col sm:flex-row items-center gap-4 shadow-soft">
          <div className="w-28 h-28 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-plum-100 bg-slate-100 relative">
            <img
              src={currentPhotoUrl}
              alt="Celebrant preview"
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-emerald-700 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Photo Attached</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              This photo will be displayed prominently across celebrations and memory timelapses.
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1.5 rounded-lg border border-plum-200 text-plum-950 font-bold text-xs hover:bg-plum-50 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isUploading ? 'animate-spin' : ''}`} />
                <span>Replace Photo</span>
              </button>

              <button
                type="button"
                onClick={onPhotoRemoved}
                disabled={isUploading}
                className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-rosewood-500 bg-rosewood-50/50 scale-[1.01]'
              : 'border-plum-200 hover:border-plum-300 bg-white/70 hover:bg-white'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-plum-50 text-rosewood-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            {isUploading ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <p className="text-xs font-bold text-plum-950 mb-0.5">
            {isUploading ? 'Uploading to permanent cloud storage...' : 'Click to upload or drag photo here'}
          </p>
          <p className="text-[11px] text-slate-500 font-light">
            PNG, JPG, WEBP, or GIF up to 5MB
          </p>
        </div>
      )}

      {/* Error notification */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Sample inspiration photos */}
      {!currentPhotoUrl && (
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Or choose a sample celebrant photo:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {samplePhotos.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onPhotoSelected(url)}
                className="aspect-square rounded-xl overflow-hidden border border-plum-100 hover:border-rosewood-500 hover:scale-105 transition-all shadow-xs"
              >
                <img src={url} alt={`Sample ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
