export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}

export interface GeneratePresignedUrlParams {
  fileName: string;
  fileType: string;
  uploadType: 'course' | 'profile' | 'certificate';
  metadata?: {
    courseId?: string;
    userId?: string;
    certificateId?: string;
    contentType?: 'thumbnail' | 'video' | 'document' | 'avatar' | 'cv';
  };
}