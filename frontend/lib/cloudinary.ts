// lib/cloudinary.ts
interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

interface UploadResult {
  secure_url: string;
  public_id: string;
  xhr: XMLHttpRequest;
}

export const uploadToCloudinary = (
  file: File,
  options: {
    uploadPreset?: string;
    folder?: string;
    onProgress?: (progress: UploadProgress) => void;
  } = {}
): Promise<UploadResult> => {
  const uploadPreset =process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiBaseUrl = process.env.NEXT_PUBLIC_CLOUDINARY_API_BASE_URL;

  if (!cloudName) {
    throw new Error("Cloudinary cloud name is not configured.");
  }
  if (!uploadPreset) {
    throw new Error("Cloudinary upload preset is not configured.");
  }
  if (!apiBaseUrl) {
    throw new Error("Cloudinary API base URL is not configured.");
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    if (options.folder) {
      formData.append("folder", options.folder);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${apiBaseUrl}/${cloudName}/image/upload`, true);

    if (options.onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          options.onProgress?.({
            loaded: event.loaded,
            total: event.total,
            percent: Math.round(percent),
          });
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          secure_url: response.secure_url,
          public_id: response.public_id,
          xhr,
        });
      } else {
        let errorMessage = `Upload failed with status ${xhr.status}`;
        try {
          const response = JSON.parse(xhr.responseText);
          errorMessage = response.error?.message || errorMessage;
        } catch {
          // Non-JSON response
        }
        reject(new Error(errorMessage));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload"));
    };

    xhr.onabort = () => {
      reject(new Error("Upload cancelled"));
    };

    xhr.send(formData);
  });
};
