import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, X, Upload } from 'lucide-react';

interface ModernImageUploaderProps {
  onSend: (imageFile: File, imageUrl: string) => void;
  onCancel: () => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

export function ModernImageUploader({ 
  onSend, 
  onCancel,
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}: ModernImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Please select a valid image file (${acceptedFormats.map(f => f.split('/')[1]).join(', ')})`;
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB`;
    }
    
    return null;
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSend = async () => {
    if (!selectedImage || !imagePreview) return;
    
    setIsLoading(true);
    try {
      await onSend(selectedImage, imagePreview);
    } catch (err) {
      setError('Failed to send image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
    
    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Add Image</h3>
        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="p-1 h-auto"
        >
          <X className="w-5 h-5 text-gray-500" />
        </Button>
      </div>

      {/* Upload Area */}
      {!selectedImage ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer
            ${isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-full">
              <ImageIcon className="w-8 h-8 text-gray-600" />
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Drop your image here, or click to browse
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WebP up to {maxSizeMB}MB
              </p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        /* Preview Area */
        <div className="space-y-3">
          <div className="relative group">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
            )}
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 truncate max-w-[200px]">
                {selectedImage.name}
              </span>
              <span className="text-gray-500">
                {formatFileSize(selectedImage.size)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!selectedImage ? (
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Image'}
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}