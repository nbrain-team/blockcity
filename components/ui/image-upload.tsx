'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  maxSize?: number; // in pixels (will validate width and height)
  label?: string;
  description?: string;
}

export function ImageUpload({
  value,
  onChange,
  maxSize = 500,
  label = 'Upload Image',
  description = 'Drag and drop your image here, or click to browse',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateAndProcessImage = useCallback(
    (file: File) => {
      setError(null);
      setIsLoading(true);

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        setIsLoading(false);
        return;
      }

      // Check file size (max 5MB for practical purposes)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        setIsLoading(false);
        return;
      }

      // Create image element to check dimensions
      const img = document.createElement('img');
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          // Validate dimensions
          if (img.width > maxSize || img.height > maxSize) {
            setError(`Image dimensions must be ${maxSize}x${maxSize} pixels or less. Your image is ${img.width}x${img.height} pixels.`);
            setIsLoading(false);
            return;
          }

          // Convert to base64
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const base64 = canvas.toDataURL(file.type);
            onChange(base64);
            setIsLoading(false);
          } else {
            setError('Failed to process image');
            setIsLoading(false);
          }
        };

        img.onerror = () => {
          setError('Failed to load image');
          setIsLoading(false);
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        setError('Failed to read file');
        setIsLoading(false);
      };

      reader.readAsDataURL(file);
    },
    [maxSize, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        validateAndProcessImage(file);
      }
    },
    [validateAndProcessImage]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        validateAndProcessImage(file);
      }
    },
    [validateAndProcessImage]
  );

  const handleRemove = useCallback(() => {
    onChange('');
    setError(null);
  }, [onChange]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {value ? (
        <div className="relative">
          <div className="rounded-lg border border-gray-300 bg-white p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
                <Image
                  src={value}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Image uploaded</p>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum size: {maxSize}x{maxSize} pixels
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative rounded-lg border-2 border-dashed p-8 text-center transition-colors
              ${isDragging 
                ? 'border-[#bc4a4b] bg-red-50' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }
              ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
            `}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              disabled={isLoading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              
              <div className="text-sm text-gray-600">
                {isLoading ? (
                  <p className="font-medium">Processing image...</p>
                ) : (
                  <>
                    <p className="font-medium text-[#bc4a4b]">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {description}
                    </p>
                  </>
                )}
              </div>
              
              <p className="text-xs text-gray-500">
                Maximum size: {maxSize}x{maxSize} pixels | PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}

