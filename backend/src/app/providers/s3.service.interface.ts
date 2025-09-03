export interface S3ServiceInterface {
  generatePresignedPutUrl(
    key: string,
    contentType: string,
    expiresInSeconds?: number
  ): Promise<{ uploadUrl: string; key: string }>;

  generatePresignedGetUrl(
    key: string,
    expiresInSeconds?: number
  ): Promise<string>;

  generateS3Key(
    fileName: string,
    uploadType: 'course' | 'profile' | 'certificate' | 'chat',
    metadata?: {
      courseId?: string;
      userId?: string;
      certificateId?: string;
      contentType?: 'thumbnail' | 'video' | 'document' | 'avatar' | 'cv';
    }
  ): string;
  
  uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    fileType: string,
    uploadType: 'course' | 'profile' | 'certificate' | 'chat',
    metadata?: {
      courseId?: string;
      userId?: string;
      certificateId?: string;
      contentType?: 'thumbnail' | 'video' | 'document' | 'avatar' | 'cv';
    }
  ): Promise<string>; // returns S3 key
  
  deleteFile(fileUrlOrKey: string): Promise<void>;
} 