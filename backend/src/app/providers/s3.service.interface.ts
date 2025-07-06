export interface S3ServiceInterface {
  generatePresignedUrl(fileName: string, fileType: string): Promise<{
    uploadUrl: string;
    fileUrl: string;
  }>;
  deleteFile(fileUrl: string): Promise<void>;
} 