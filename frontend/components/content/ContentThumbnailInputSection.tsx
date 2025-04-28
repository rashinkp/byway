import { useState, useEffect, useCallback } from "react";

interface ThumbnailUploadInputProps {
  file: File | null;
  setFile: (file: File | null) => void;
  fileUrl: string;
  setFileUrl: (fileUrl: string) => void;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  uploadProgress: number;
  setUploadStatus: (status: "idle" | "uploading" | "success" | "error") => void;
  setUploadProgress: (progress: number) => void;
  errors: { thumbnail?: string };
}

export const ThumbnailUploadInput = ({
  file,
  setFile,
  fileUrl,
  setFileUrl,
  uploadStatus,
  uploadProgress,
  setUploadStatus,
  setUploadProgress,
  errors,
}: ThumbnailUploadInputProps) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      process.env.NEXT_PUBLIC_CLOUDINARY_WIDGET_URL 
      || "https://widget.cloudinary.com/v2.0/global/all.js";
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

  const uploadToCloudinary = useCallback(
    async (file: File): Promise<string> => {
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
        xhr.open("POST", `${apiBaseUrl}/${cloudName}/image/upload`, true);

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
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Thumbnail Image or URL
      </label>
      <div className="flex flex-col space-y-2">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-2 border border-gray-300 rounded-md"
          accept="image/jpeg,image/png,image/webp"
        />
        <input
          type="text"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
            errors.thumbnail ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Or enter thumbnail URL"
        />
        {errors.thumbnail && (
          <p className="mt-1 text-sm text-red-500">{errors.thumbnail}</p>
        )}
        {uploadStatus === "uploading" && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Uploading... Please do not refresh the page.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        {uploadStatus === "success" && (
          <p className="mt-2 text-sm text-green-600">Upload Complete</p>
        )}
        {uploadStatus === "error" && (
          <p className="mt-2 text-sm text-red-500">Upload Failed</p>
        )}
      </div>
    </div>
  );
};


ThumbnailUploadInput.uploadToCloudinary = async (
  file: File,
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
    xhr.open("POST", `${apiBaseUrl}/${cloudName}/image/upload`, true);

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
