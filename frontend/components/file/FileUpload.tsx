import React, { useCallback, useRef } from "react";
import { useFileUpload } from "@/hooks/file/useFileUpload";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Upload } from "lucide-react";
import { cn } from "@/utils/cn";

interface FileUploadProps {
  onUploadComplete: (fileUrl: string) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  disabled?: boolean;
  description?: string;
  label?: string;
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
  disabled = false,
  description,
  label = "Upload File",
}: FileUploadProps) {
  const { uploadFile, progress, isUploading, error, reset } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file size
      if (file.size > maxSize) {
        const errorMessage = `File size exceeds ${maxSize / (1024 * 1024)}MB limit`;
        onUploadError?.(errorMessage);
        return;
      }

      try {
        const fileUrl = await uploadFile(file);
        onUploadComplete(fileUrl);
      } catch (err) {
        onUploadError?.(err instanceof Error ? err.message : "Upload failed");
      }
    },
    [uploadFile, maxSize, onUploadComplete, onUploadError]
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <div className="flex items-center gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={accept}
          disabled={disabled || isUploading}
          className="flex-1 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          variant="outline"
          size="sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Browse"}
        </Button>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-muted-foreground">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 