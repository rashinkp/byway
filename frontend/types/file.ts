export interface PresignedPutResponse {
  uploadUrl: string;
  key: string;
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