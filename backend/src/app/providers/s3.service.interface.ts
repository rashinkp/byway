export interface S3ServiceInterface {
  generatePresignedUrl(
    fileName: string, 
    fileType: string, 
    uploadType: 'course' | 'profile' | 'certificate',
    metadata?: {
      courseId?: string;
      userId?: string;
      certificateId?: string;
      contentType?: 'thumbnail' | 'video' | 'document' | 'avatar' | 'cv';
    }
  ): Promise<{
    uploadUrl: string;
    fileUrl: string;
  }>;
  
  uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    fileType: string,
    uploadType: 'course' | 'profile' | 'certificate',
    metadata?: {
      courseId?: string;
      userId?: string;
      certificateId?: string;
      contentType?: 'thumbnail' | 'video' | 'document' | 'avatar' | 'cv';
    }
  ): Promise<string>;
  
  deleteFile(fileUrl: string): Promise<void>;
} 