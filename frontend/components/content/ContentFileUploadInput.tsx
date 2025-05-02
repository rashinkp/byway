import { useState, useEffect, useCallback } from "react";
import { ContentType } from "@/types/content";
import { Upload, File, CheckCircle, XCircle } from "lucide-react";

interface FileUploadInputProps {
  type: ContentType;
  file: File | null;
  setFile: (file: File | null) => void;
  fileUrl: string;
  setFileUrl: (fileUrl: string) => void;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  uploadProgress: number;
  setUploadStatus: (status: "idle" | "uploading" | "success" | "error") => void;
  setUploadProgress: (progress: number) => void;
  errors: { file?: string };
}

export const FileUploadInput = ({
  type,
  file,
  setFile,
  fileUrl,
  setFileUrl,
  uploadStatus,
  uploadProgress,
  setUploadStatus,
  setUploadProgress,
  errors,
}: FileUploadInputProps) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      process.env.NEXT_PUBLIC_CLOUDINARY_WIDGET_URL ||
      "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => setIsScriptLoaded(false);
    document.body.appendChild(script);

    return () => {
      setTimeout(() => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      }, 1000);
    };
  }, []);

  const getFileTypeLabel = () => {
    if (type === ContentType.VIDEO) {
      return "video (MP4, WebM, Ogg)";
    }
    return "document (PDF, DOCX, DOC)";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const uploadToCloudinary = useCallback(
    async (file: File, contentType: ContentType): Promise<string> => {
      if (!isScriptLoaded || !window.cloudinary) {
        throw new Error("Cloudinary widget not loaded");
      }

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      const apiBaseUrl = process.env.NEXT_PUBLIC_CLOUDINARY_API_BASE_URL;

      if (!cloudName || !uploadPreset || !apiBaseUrl) {
        throw new Error("Cloudinary configuration missing");
      }

      return new Promise((resolve, reject) => {
        setUploadStatus("uploading");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("cloud_name", cloudName);

        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `${apiBaseUrl}/${cloudName}/${
            contentType === ContentType.VIDEO ? "video" : "auto"
          }/upload`,
          true
        );

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress((event.loaded / event.total) * 100);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setUploadStatus("success");
            resolve(response.secure_url);
          } else {
            setUploadStatus("error");
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => {
          setUploadStatus("error");
          reject(new Error("Upload failed"));
        };

        xhr.send(formData);
      });
    },
    [isScriptLoaded, setUploadStatus, setUploadProgress]
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        {type === ContentType.VIDEO ? "Video File" : "Document File"}
      </label>

      <div
        className={`relative p-6 border-2 border-dashed rounded-xl transition-all duration-300 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : errors.file
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          {file ? (
            <div className="flex items-center space-x-3 bg-blue-100 px-4 py-2 rounded-lg">
              <File className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium text-gray-800 max-w-xs truncate">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-blue-500" />
              <div className="text-center">
                <p className="text-gray-700 font-medium">
                  Drag & drop your {getFileTypeLabel()} here
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  or click to browse files
                </p>
              </div>
            </>
          )}

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={
              type === ContentType.VIDEO
                ? "video/mp4,video/webm,video/ogg"
                : "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            }
          />
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className={`w-full p-3 pr-10 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
            errors.file ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Or enter file URL"
        />
        {fileUrl && (
          <button
            type="button"
            onClick={() => setFileUrl("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>

      {errors.file && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <XCircle className="h-4 w-4 mr-1" />
          {errors.file}
        </p>
      )}

      {uploadStatus === "uploading" && (
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-blue-600 font-medium">Uploading...</span>
            <span className="text-gray-600">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Please do not refresh the page
          </p>
        </div>
      )}

      {uploadStatus === "success" && (
        <p className="mt-2 text-sm text-green-600 flex items-center">
          <CheckCircle className="h-4 w-4 mr-1" />
          Upload Complete
        </p>
      )}

      {uploadStatus === "error" && (
        <p className="mt-2 text-sm text-red-500 flex items-center">
          <XCircle className="h-4 w-4 mr-1" />
          Upload Failed
        </p>
      )}
    </div>
  );
};

FileUploadInput.uploadToCloudinary = async (
  file: File,
  contentType: ContentType,
  setUploadStatus: (status: "idle" | "uploading" | "success" | "error") => void,
  setUploadProgress: (progress: number) => void
): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const apiBaseUrl = process.env.NEXT_PUBLIC_CLOUDINARY_API_BASE_URL;

  if (!cloudName || !uploadPreset || !apiBaseUrl) {
    throw new Error("Cloudinary configuration missing");
  }

  return new Promise((resolve, reject) => {
    setUploadStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `${apiBaseUrl}/${cloudName}/${
        contentType === ContentType.VIDEO ? "video" : "auto"
      }/upload`,
      true
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress((event.loaded / event.total) * 100);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setUploadStatus("success");
        resolve(response.secure_url);
      } else {
        setUploadStatus("error");
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => {
      setUploadStatus("error");
      reject(new Error("Upload failed"));
    };

    xhr.send(formData);
  });
};
