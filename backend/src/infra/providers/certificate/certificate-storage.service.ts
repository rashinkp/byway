import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { CertificateStorageServiceInterface } from '../../../app/providers/certificate-storage.interface';
import { awsConfig } from '../../../infra/config/aws.config';

export class CertificateStorageService implements CertificateStorageServiceInterface {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    if (!awsConfig.bucketName) {
      throw new Error('AWS bucket name is required');
    }
    this.bucketName = awsConfig.bucketName;
    this.s3Client = new S3Client({
      region: awsConfig.region,
      credentials: awsConfig.credentials,
    });
  }

  async uploadCertificate(pdfBuffer: Buffer, certificateNumber: string): Promise<string> {
    try {
      const key = `certificates/${certificateNumber}.pdf`;
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
        ContentDisposition: 'inline',
        CacheControl: 'public, max-age=31536000', // 1 year cache
      });

      await this.s3Client.send(command);

      // Return the public URL
      const fileUrl = `https://${this.bucketName}.s3.${awsConfig.region}.amazonaws.com/${key}`;
      return fileUrl;
    } catch (error) {
      console.error('Error uploading certificate to S3:', error);
      throw new Error('Failed to upload certificate to cloud storage');
    }
  }

  async deleteCertificate(certificateUrl: string): Promise<void> {
    try {
      // Extract the key from the URL
      const urlParts = certificateUrl.split('/');
      const key = urlParts.slice(3).join('/'); // Remove https://bucket.s3.region.amazonaws.com/

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting certificate from S3:', error);
      throw new Error('Failed to delete certificate from cloud storage');
    }
  }
} 