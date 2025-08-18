import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { envConfig } from "../../presentation/express/configs/env.config";

dotenv.config();

export const awsConfig = {
  credentials: {
    accessKeyId: envConfig.AWS_ACCESS_KEY_ID,
    secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
  },
  region: envConfig.AWS_REGION,
  bucketName: envConfig.AWS_BUCKET_NAME,
};

export const s3Client = new S3Client({
  credentials: awsConfig.credentials,
  region: awsConfig.region,
}); 