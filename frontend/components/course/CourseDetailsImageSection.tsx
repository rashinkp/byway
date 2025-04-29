"use client";

import Image, { StaticImageData } from "next/image";
import { Button } from "../ui/button";
import { Loader2, Upload, X, AlertCircle } from "lucide-react";
import { Progress } from "../ui/progress";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

export const ImageSection = ({
  src,
  alt,
  onImageChange,
  isUploading,
  uploadProgress,
  uploadError,
}: {
  src: string | StaticImageData;
  alt: string;
  onImageChange: (file: File | null) => void;
  isUploading: boolean;
  uploadProgress: number | null;
  uploadError?: string | null;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File too large", {
            description: "File size must be less than 5MB.",
          });
          return;
        }
        setPreviewSrc(URL.createObjectURL(file));
        onImageChange(file);
      } else {
        toast.error("Invalid file", {
          description: "Please drop a valid image file.",
        });
      }
    },
    [onImageChange, toast]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "File size must be less than 5MB.",
        });
        return;
      }
      setPreviewSrc(URL.createObjectURL(file));
      onImageChange(file);
    } else {
      toast.error("Invalid file", {
        description: "Please select a valid image file.",
      });
    }
  };

  const handleCancelUpload = () => {
    onImageChange(null); // Signal parent to cancel upload
    setPreviewSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleRetryUpload = () => {
    if (fileInputRef.current?.files?.[0]) {
      onImageChange(fileInputRef.current.files[0]);
    }
  };

  return (
    <div
      className={`relative group mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-shadow duration-300 ${
        isDragging ? "border-2 border-dashed border-blue-500 bg-blue-50" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-label="Course thumbnail section"
    >
      <div className="relative w-full h-64">
        <img
          src={
            typeof previewSrc === "string"
              ? previewSrc
              : typeof src === "string"
              ? src
              : (src as StaticImageData).src
          }
          alt={alt}
          className="object-contain w-full h-full transition-opacity duration-300"
        />
        {!isUploading && !uploadError && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white/20 bg-black/50"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                aria-label="Change course thumbnail"
              >
                <Upload className="mr-2 h-4 w-4" />
                Change Image
              </Button>
              <p className="text-white text-sm">or drag and drop here</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white rounded-lg">
          {uploadProgress !== null ? (
            <div className="space-y-4 w-64">
              <Progress
                value={uploadProgress}
                className="w-full h-2 bg-white/20"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">
                  Uploading: {uploadProgress}%
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelUpload}
                  aria-label="Cancel upload"
                  className="text-white hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Loader2 className="h-8 w-8 animate-spin" aria-label="Uploading" />
          )}
        </div>
      )}

      {uploadError && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white rounded-lg space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <p className="text-sm font-medium">{uploadError}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryUpload}
              className="text-white border-white hover:bg-white/20"
              aria-label="Retry upload"
            >
              Retry
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelUpload}
              className="text-white hover:text-red-400"
              aria-label="Cancel"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
