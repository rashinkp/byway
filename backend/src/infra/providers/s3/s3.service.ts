import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3ServiceInterface } from "../../../app/providers/s3.service.interface";
import { awsConfig } from "../../../infra/config/aws.config";
import { ILogger } from "../../../app/providers/logger-provider.interface";

export class S3Service implements S3ServiceInterface {
  private readonly _s3Client: S3Client;
  private readonly _bucketName: string;
  private readonly _urlExpirationTime = 3600; // 1 hour in seconds
  private readonly _logger: ILogger;

  constructor(logger: ILogger) {
    this._logger = logger;
    if (!awsConfig.bucketName) {
      throw new Error("AWS bucket name is required");
    }
    this._bucketName = awsConfig.bucketName;
    this._s3Client = new S3Client({
      region: awsConfig.region,
      credentials: awsConfig.credentials,
    });
  }

  async generatePresignedUrl(
    fileName: string,
    fileType: string,
    uploadType: "course" | "profile" | "certificate",
    metadata?: {
      courseId?: string;
      userId?: string;
      certificateId?: string;
      contentType?: "thumbnail" | "video" | "document" | "avatar" | "cv";
    }
  ): Promise<{
    uploadUrl: string;
    fileUrl: string;
  }> {
    const key = this.generateS3Key(fileName, uploadType, metadata);

    const command = new PutObjectCommand({
      Bucket: this._bucketName,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(this._s3Client, command, {
      expiresIn: this._urlExpirationTime,
    });

    const fileUrl = `https://${this._bucketName}.s3.${awsConfig.region}.amazonaws.com/${key}`;

    return {
      uploadUrl,
      fileUrl,
    };
  }

  // New method for direct server-side uploads (like certificate generation)
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    fileType: string,
    uploadType: "course" | "profile" | "certificate",
    metadata?: {
      courseId?: string;
      userId?: string;
      certificateId?: string;
      contentType?: "thumbnail" | "video" | "document" | "avatar" | "cv";
    }
  ): Promise<string> {
    try {
      const key = this.generateS3Key(fileName, uploadType, metadata);

      const command = new PutObjectCommand({
        Bucket: this._bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: fileType,
        ContentDisposition: "inline",
        CacheControl: "public, max-age=31536000", // 1 year cache
      });

      await this._s3Client.send(command);

      // Return the public URL
      const fileUrl = `https://${this._bucketName}.s3.${awsConfig.region}.amazonaws.com/${key}`;
      return fileUrl;
    } catch (error) {
      this._logger.error("Error uploading file to S3:", error);
      throw new Error("Failed to upload file to cloud storage");
    }
  }

  private generateS3Key(
    fileName: string,
    uploadType: "course" | "profile" | "certificate",
    metadata?: {
      courseId?: string;
      userId?: string;
      certificateId?: string;
      contentType?: "thumbnail" | "video" | "document" | "avatar" | "cv";
    }
  ): string {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

    switch (uploadType) {
      case "certificate":
        if (!metadata?.courseId || !metadata?.certificateId) {
          throw new Error(
            "Course ID and Certificate ID are required for certificate uploads"
          );
        }
        return `certificates/${metadata.courseId}/${metadata.certificateId}.pdf`;

      case "course":
        if (!metadata?.courseId) {
          throw new Error("Course ID is required for course uploads");
        }

        if (metadata.contentType === "thumbnail") {
          return `courses/${metadata.courseId}/thumbnail/${timestamp}-${sanitizedFileName}`;
        } else if (metadata.contentType === "video") {
          return `courses/${metadata.courseId}/videos/${timestamp}-${sanitizedFileName}`;
        } else if (metadata.contentType === "document") {
          return `courses/${metadata.courseId}/documents/${timestamp}-${sanitizedFileName}`;
        } else {
          // Default course content
          return `courses/${metadata.courseId}/content/${timestamp}-${sanitizedFileName}`;
        }

      case "profile":
        if (!metadata?.userId) {
          throw new Error("User ID is required for profile uploads");
        }

        // Simplified profile structure - no subfolders
        if (metadata.contentType === "avatar") {
          return `profile/${metadata.userId}/avatar.jpg`;
        } else if (metadata.contentType === "cv") {
          return `profile/${metadata.userId}/cv.pdf`;
        } else {
          // Generic profile files
          return `profile/${metadata.userId}/${timestamp}-${sanitizedFileName}`;
        }

      default:
        throw new Error(`Invalid upload type: ${uploadType}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const url = new URL(fileUrl);
      const key = url.pathname.startsWith("/")
        ? url.pathname.slice(1)
        : url.pathname;
      const command = new DeleteObjectCommand({
        Bucket: this._bucketName,
        Key: key,
      });
      await this._s3Client.send(command);
    } catch (error) {
      this._logger.error("Failed to delete file from S3:", error);
      throw new Error("Failed to delete file from S3");
    }
  }
}
