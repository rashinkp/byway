import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X, Upload } from "lucide-react";
import { useFileUpload } from "@/hooks/file/useFileUpload";
import Image from "next/image";

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
  acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
}: ModernImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const {
    uploadFile,
    progress,
    isUploading,
    error: uploadError,
    reset,
  } = useFileUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Please select a valid image file (${acceptedFormats.map((f) => f.split("/")[1]).join(", ")})`;
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
    if (!selectedImage) return;
    setError(null);
    reset();
    try {
      const s3Url = await uploadFile(selectedImage, 'chat');
      await onSend(selectedImage, s3Url);
      setSelectedImage(null);
      setImagePreview(null);
      reset();
    } catch {
      setError("Failed to upload image. Please try again.");
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="flex flex-col gap-4 p-4  rounded-lg shadow-sm mt-10 transition-colors duration-300">
      {/* Header */}
    

      {/* Upload Area */}
      {!selectedImage ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer
            ${isDragging ? "border-[#facc15] bg-[#facc15]/10" : "border-gray-300 dark:border-gray-700 hover:border-[#facc15]/50 hover:bg-[#facc15]/5"}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-[#facc15]/10 dark:bg-[#facc15]/20 rounded-full">
              <ImageIcon className="w-8 h-8 text-[#facc15]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Drop your image here, or click to browse
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF, WebP up to {maxSizeMB}MB
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative group">
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                style={{ opacity: isUploading ? 0.5 : 1 }}
                width={400}
                height={192}
              />
            )}
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-[#18181b]/60 rounded-lg">
                <Upload className="w-8 h-8 text-[#facc15] animate-bounce mb-2" />
                <span className="text-sm text-[#facc15] font-medium">
                  Uploading... {progress}%
                </span>
              </div>
            )}
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                {selectedImage.name}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
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
            variant="default"
            className="flex-1 bg-[#facc15] hover:bg-[#facc15]/80 text-black"
          >
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
          </Button>
        </div>
      ) : (
        <div className="flex gap-2 justify-end">
          <Button
            onClick={handleSend}
            disabled={isUploading}
            className="bg-[#facc15] hover:bg-[#facc15]/80 text-black"
          >
            {isUploading ? "Uploading..." : "Send"}
          </Button>
          <Button onClick={onCancel} variant="ghost" disabled={isUploading} className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#facc15]/10">
            Cancel
          </Button>
        </div>
      )}

      {/* Error Message */}
      {(error || uploadError) && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-red-600 dark:text-red-300 text-sm">{error || uploadError}</p>
        </div>
      )}
    </div>
  );
}