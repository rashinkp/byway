interface CloudinaryWidget {
  openUploadWidget: (
    options: {
      cloudName: string;
      uploadPreset: string;
      sources?: string[];
      resourceType?: string;
      maxFileSize?: number;
    },
    callback: (error: any, result: any) => void
  ) => void;
}

interface Window {
  cloudinary?: CloudinaryWidget;
}
