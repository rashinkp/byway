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
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
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
    [onImageChange]
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
    onImageChange(null);
    setPreviewSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRetryUpload = () => {
    if (fileInputRef.current?.files?.[0])
      onImageChange(fileInputRef.current.files[0]);
  };

  return (
    <div
      className={`relative w-48 h-48 rounded-lg overflow-hidden transition-colors ${
        isDragging
          ? "border-2 border-dashed border-blue-400 bg-blue-50"
          : "border border-gray-200"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <img
        src={
          previewSrc ||
          (typeof src === "string" ? src : (src as StaticImageData).src)
        }
        alt={alt}
        className="object-cover w-full h-full"
      />
      {!isUploading && !uploadError && (
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-white"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}
      {isUploading && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
          {uploadProgress !== null ? (
            <div className="space-y-2 w-32">
              <Progress value={uploadProgress} className="h-1" />
              <p className="text-xs">{uploadProgress}%</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelUpload}
                className="text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Loader2 className="h-6 w-6 animate-spin" />
          )}
        </div>
      )}
      {uploadError && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white space-y-2">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="text-xs">{uploadError}</p>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetryUpload}
              className="text-white"
            >
              Retry
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelUpload}
              className="text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
