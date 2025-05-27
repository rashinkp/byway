import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3ServiceInterface } from '../../../app/providers/s3.service.interface';
import { envConfig } from '../../../presentation/express/configs/env.config';

export class S3Service implements S3ServiceInterface {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly urlExpirationTime = 60; // 1 minute in seconds

  constructor() {
    this.bucketName = envConfig.AWS_BUCKET_NAME;
    this.s3Client = new S3Client({
      region: envConfig.AWS_REGION,
      credentials: {
        accessKeyId: envConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async generatePresignedUrl(fileName: string, fileType: string): Promise<{
    uploadUrl: string;
    fileUrl: string;
  }> {
    const key = `uploads/${Date.now()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.urlExpirationTime,
    });

    const fileUrl = `https://${this.bucketName}.s3.${envConfig.AWS_REGION}.amazonaws.com/${key}`;

    return {
      uploadUrl,
      fileUrl,
    };
  }
} 