'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/src/lib/supabase/client';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

export interface ImageUploadProps {
  /**
   * Storage bucket name in Supabase
   */
  bucket: string;
  
  /**
   * Optional folder path within the bucket
   */
  folder?: string;
  
  /**
   * Whether to allow multiple file uploads
   */
  multiple?: boolean;
  
  /**
   * Maximum file size in MB
   */
  maxSizeMB?: number;
  
  /**
   * Accepted file types
   */
  accept?: string;
  
  /**
   * Callback when upload completes successfully
   */
  onUploadComplete?: (urls: string[]) => void;
  
  /**
   * Callback when upload fails
   */
  onUploadError?: (error: Error) => void;
  
  /**
   * Existing image URLs to display
   */
  existingImages?: string[];
  
  /**
   * Callback when an existing image is removed
   */
  onRemoveExisting?: (url: string) => void;
  
  /**
   * Custom class name
   */
  className?: string;
}

interface UploadingFile {
  file: File;
  preview: string;
  progress: number;
  error?: string;
}

export default function ImageUpload({
  bucket,
  folder = '',
  multiple = false,
  maxSizeMB = 5,
  accept = 'image/jpeg,image/png,image/webp',
  onUploadComplete,
  onUploadError,
  existingImages = [],
  onRemoveExisting,
  className = '',
}: ImageUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const validateFile = (file: File): string | null => {
    // Check file type
    const acceptedTypes = accept.split(',').map(t => t.trim());
    if (!acceptedTypes.some(type => file.type.match(type.replace('*', '.*')))) {
      return `File type ${file.type} is not accepted`;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB limit`;
    }

    return null;
  }

  const uploadFile = async (file: File, index: number): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesToUpload = Array.from(files).slice(0, multiple ? files.length : 1);
    
    // Validate and create preview for each file
    const newUploadingFiles: UploadingFile[] = [];
    
    for (const file of filesToUpload) {
      const validationError = validateFile(file);
      
      if (validationError) {
        if (onUploadError) {
          onUploadError(new Error(validationError));
        }
        continue;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);
      
      newUploadingFiles.push({
        file,
        preview,
        progress: 0,
        error: undefined,
      });
    }

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload files
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < newUploadingFiles.length; i++) {
      const uploadingFile = newUploadingFiles[i];
      const fileIndex = uploadingFiles.length + i;
      
      try {
        // Simulate progress (Supabase doesn't provide real-time progress)
        setUploadingFiles(prev => 
          prev.map((f, idx) => 
            idx === fileIndex ? { ...f, progress: 50 } : f
          )
        );

        const url = await uploadFile(uploadingFile.file, fileIndex);
        
        setUploadingFiles(prev => 
          prev.map((f, idx) => 
            idx === fileIndex ? { ...f, progress: 100 } : f
          )
        );

        uploadedUrls.push(url);
        
        // Clean up preview URL
        URL.revokeObjectURL(uploadingFile.preview);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        
        setUploadingFiles(prev => 
          prev.map((f, idx) => 
            idx === fileIndex ? { ...f, error: errorMessage, progress: 0 } : f
          )
        );

        if (onUploadError) {
          onUploadError(error instanceof Error ? error : new Error(errorMessage));
        }
      }
    }

    // Remove completed uploads after a delay
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(f => f.progress !== 100));
    }, 1000);

    if (uploadedUrls.length > 0 && onUploadComplete) {
      onUploadComplete(uploadedUrls);
    }
  }, [bucket, folder, multiple, maxSizeMB, accept, onUploadComplete, onUploadError, uploadingFiles.length]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleRemoveUploading = (index: number) => {
    setUploadingFiles(prev => {
      const file = prev[index];
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleRemoveExisting = (url: string) => {
    if (onRemoveExisting) {
      onRemoveExisting(url);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {existingImages.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                <img
                  src={url}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => handleRemoveExisting(url)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className={`
            p-4 rounded-full transition-colors
            ${isDragging ? 'bg-green-100' : 'bg-gray-100'}
          `}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-green-600' : 'text-gray-400'}`} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-xs text-gray-700 font-medium mb-3">
              or click the button below to browse
            </p>
            <Button
              type="button"
              onClick={openFileDialog}
              variant="outline"
              size="sm"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose {multiple ? 'Files' : 'File'}
            </Button>
          </div>

          <p className="text-xs text-gray-600 font-medium">
            {accept.split(',').map(t => t.split('/')[1]).join(', ').toUpperCase()} • Max {maxSizeMB}MB
            {multiple && ' • Multiple files allowed'}
          </p>
        </div>
      </div>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          {uploadingFiles.map((uploadingFile, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              {/* Preview */}
              <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={uploadingFile.preview}
                  alt={uploadingFile.file.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {uploadingFile.file.name}
                </p>
                <p className="text-xs text-gray-700 font-medium">
                  {(uploadingFile.file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                {/* Progress Bar */}
                {!uploadingFile.error && uploadingFile.progress < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadingFile.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Success */}
                {uploadingFile.progress === 100 && !uploadingFile.error && (
                  <p className="text-xs text-green-600 mt-1">Upload complete</p>
                )}

                {/* Error */}
                {uploadingFile.error && (
                  <p className="text-xs text-red-600 mt-1">{uploadingFile.error}</p>
                )}
              </div>

              {/* Status Icon */}
              <div className="flex-shrink-0">
                {uploadingFile.progress > 0 && uploadingFile.progress < 100 && !uploadingFile.error && (
                  <LoadingSpinner size="sm" />
                )}
                {uploadingFile.error && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUploading(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                    aria-label="Remove failed upload"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
