import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

export const awsConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  region: process.env.AWS_REGION || 'ap-south-1',
  bucketName: process.env.S3_BUCKET_NAME || '',
};

if (!awsConfig.credentials.accessKeyId || !awsConfig.credentials.secretAccessKey || !awsConfig.bucketName) {
  throw new Error('Missing required AWS configuration in .env file');
}

export const s3Client = new S3Client({
  credentials: awsConfig.credentials,
  region: awsConfig.region,
}); 