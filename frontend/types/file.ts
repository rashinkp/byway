export interface PresignedPutResponse {
  uploadUrl: string;
  key: string; // Cloudinary public id
  publicId: string;
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: string;
}

export interface GeneratePresignedUrlParams {
  fileName: string;
  fileType: string;
  uploadType: 'course' | 'profile' | 'certificate' | 'chat';
  metadata?: {
    courseId?: string;
    userId?: string;
    certificateId?: string;
    contentType?: 'thumbnail' | 'video' | 'document' | 'avatar' | 'cv';
  };
  fileSize?: number;
}

export interface PresignedGetResponse {
  signedUrl: string;
}