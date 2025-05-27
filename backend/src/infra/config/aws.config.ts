import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION || !process.env.AWS_BUCKET_NAME) {
  throw new Error('Missing required AWS configuration in .env file');
}

export const awsConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
  bucketName: process.env.AWS_BUCKET_NAME,
};

export const s3Client = new S3Client({
  credentials: awsConfig.credentials,
  region: awsConfig.region,
}); 