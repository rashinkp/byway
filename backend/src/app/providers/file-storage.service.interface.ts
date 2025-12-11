export type UploadType = "course" | "profile" | "certificate" | "chat";

export type UploadContentType =
  | "thumbnail"
  | "video"
  | "document"
  | "avatar"
  | "cv";

export interface UploadMetadata {
  courseId?: string;
  userId?: string;
  certificateId?: string;
  contentType?: UploadContentType;
}

export interface UploadParams {
  uploadUrl: string;
  key: string; // Cloudinary public id (folder + identifier)
  publicId: string;
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: string;
}

export interface FileStorageServiceInterface {
  generateUploadParams(
    fileName: string,
    fileType: string,
    uploadType: UploadType,
    metadata?: UploadMetadata
  ): Promise<UploadParams>;

  generateDownloadUrl(
    key: string,
    expiresInSeconds?: number
  ): Promise<string>;

  generateKey(
    fileName: string,
    uploadType: UploadType,
    metadata?: UploadMetadata
  ): string;

  uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    fileType: string,
    uploadType: UploadType,
    metadata?: UploadMetadata
  ): Promise<{
    key: string;
    url: string;
  }>;

  deleteFile(fileUrlOrKey: string): Promise<void>;
}

