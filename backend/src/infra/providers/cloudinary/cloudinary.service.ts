import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { FileStorageServiceInterface, UploadMetadata, UploadParams, UploadType } from "../../../app/providers/file-storage.service.interface";
import { cloudinaryConfig } from "../../config/cloudinary.config";
import { ILogger } from "../../../app/providers/logger-provider.interface";
import path from "path";

export class CloudinaryService implements FileStorageServiceInterface {
  private readonly _logger: ILogger;
  private readonly _urlExpirationTime = 3600; 

  constructor(logger: ILogger) {
    this._logger = logger;
    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey || !cloudinaryConfig.apiSecret) {
      throw new Error("Cloudinary credentials are required");
    }
  }

  async generateUploadParams(
    fileName: string,
    fileType: string,
    uploadType: UploadType,
    metadata?: UploadMetadata
  ): Promise<UploadParams> {
    const { folder, publicId, key, timestamp } = this.buildObjectIdentifiers(
      fileName,
      uploadType,
      metadata
    );

    // Sign only the parameters Cloudinary expects in the request body
    const signaturePayload = {
      timestamp,
      folder,
      public_id: publicId,
      type: "authenticated",
      access_mode: "authenticated",
    };

    const signature = cloudinary.utils.api_sign_request(
      signaturePayload,
      cloudinaryConfig.apiSecret
    );

    return {
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`,
      key,
      publicId,
      signature,
      timestamp,
      apiKey: cloudinaryConfig.apiKey,
      cloudName: cloudinaryConfig.cloudName,
      folder: signaturePayload.folder,
      resourceType: "auto",
    };
  }

  async generateDownloadUrl(
    key: string,
    expiresInSeconds: number = this._urlExpirationTime
  ): Promise<string> {
    if (key.startsWith("http://") || key.startsWith("https://")) {
      return key;
    }
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const publicId = this.normalizePublicId(key);

    // Use the typed url helper with signing for authenticated assets
    return cloudinary.utils.url(publicId, {
      resource_type: "auto",
      type: "authenticated",
      sign_url: true,
      secure: true,
      expires_at: expiresAt,
    });
  }

  generateKey(
    fileName: string,
    uploadType: UploadType,
    metadata?: UploadMetadata
  ): string {
    const { key } = this.buildObjectIdentifiers(fileName, uploadType, metadata);
    return key;
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    fileType: string,
    uploadType: UploadType,
    metadata?: UploadMetadata
  ): Promise<{ key: string; url: string }> {
    const { folder, publicId, key } = this.buildObjectIdentifiers(
      fileName,
      uploadType,
      metadata
    );

    try {
      const uploadResult = await this.streamUpload(fileBuffer, {
        folder,
        public_id: publicId,
        resource_type: "auto",
        access_mode: "authenticated",
        type: "authenticated",
        use_filename: false,
        overwrite: true,
        invalidate: true,
      });

      return { key: uploadResult.public_id, url: uploadResult.secure_url };
    } catch (error) {
      this._logger.error("Error uploading file to Cloudinary:", error);
      throw new Error("Failed to upload file to cloud storage");
    }
  }

  async deleteFile(fileUrlOrKey: string): Promise<void> {
    try {
      const publicId = this.normalizePublicId(fileUrlOrKey);
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "auto",
        type: "authenticated",
        invalidate: true,
      });

      if (result.result !== "ok" && result.result !== "not found") {
        this._logger.warn(`Cloudinary delete returned unexpected status: ${result.result}`);
      }
    } catch (error) {
      this._logger.error("Failed to delete file from Cloudinary:", error);
      throw new Error("Failed to delete file from Cloudinary");
    }
  }

  private getFolder(uploadType: UploadType, metadata?: UploadMetadata): string {
    switch (uploadType) {
      case "certificate": {
        if (!metadata?.courseId || !metadata?.certificateId) {
          throw new Error("Course ID and Certificate ID are required for certificate uploads");
        }
        return `${cloudinaryConfig.folder}/certificates/${metadata.courseId}`;
      }
      case "course": {
        if (!metadata?.courseId) {
          throw new Error("Course ID is required for course uploads");
        }
        const base = `${cloudinaryConfig.folder}/courses/${metadata.courseId}`;
        switch (metadata.contentType) {
          case "thumbnail":
            return `${base}/thumbnail`;
          case "video":
            return `${base}/videos`;
          case "document":
            return `${base}/documents`;
          default:
            return `${base}/content`;
        }
      }
      case "profile": {
        if (!metadata?.userId) {
          throw new Error("User ID is required for profile uploads");
        }
        const base = `${cloudinaryConfig.folder}/profile/${metadata.userId}`;
        switch (metadata.contentType) {
          case "avatar":
            return `${base}/avatar`;
          case "cv":
            return `${base}/cv`;
          default:
            return base;
        }
      }
      case "chat":
        return `${cloudinaryConfig.folder}/chat`;
      default:
        throw new Error(`Invalid upload type: ${uploadType}`);
    }
  }

  private normalizePublicId(fileUrlOrKey: string): string {
    if (!fileUrlOrKey) {
      throw new Error("File identifier is required");
    }

    if (!fileUrlOrKey.startsWith("http://") && !fileUrlOrKey.startsWith("https://")) {
      return fileUrlOrKey.replace(/^\/+/, "");
    }

    try {
      const url = new URL(fileUrlOrKey);
      const pathParts = url.pathname.split("/upload/");
      if (pathParts.length < 2) {
        return fileUrlOrKey;
      }

      const afterUpload = pathParts[1];
      const withoutExtension = afterUpload.replace(/\.[^/.]+$/, "");
      return withoutExtension;
    } catch {
      return fileUrlOrKey;
    }
  }

  private buildObjectIdentifiers(
    fileName: string,
    uploadType: UploadType,
    metadata?: UploadMetadata
  ): { folder: string; publicId: string; key: string; timestamp: number } {
    const sanitizedFileName = path
      .parse(fileName)
      .name.replace(/[^a-zA-Z0-9_-]/g, "_");
    const folder = this.getFolder(uploadType, metadata);
    const timestamp = Date.now();
    const publicId = `${timestamp}-${sanitizedFileName}`;
    const key = `${folder}/${publicId}`;

    return { folder, publicId, key, timestamp: Math.floor(timestamp / 1000) };
  }

  private streamUpload(
    fileBuffer: Buffer,
    options: {
      folder: string;
      public_id: string;
      resource_type: "auto";
      access_mode: "authenticated";
      type: "authenticated";
      use_filename: boolean;
      overwrite: boolean;
      invalidate: boolean;
    }
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });

      uploadStream.end(fileBuffer);
    });
  }
}

