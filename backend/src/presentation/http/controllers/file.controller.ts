import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { FileStorageServiceInterface } from "../../../app/providers/file-storage.service.interface";
import { generatePresignedUrlSchema, getPresignedGetUrlSchema } from "../../validators/file.validator";
import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";

export class FileController extends BaseController {
  constructor(
    private readonly _storageService: FileStorageServiceInterface,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  // Returns signed Cloudinary upload params and the storage key
  generatePresignedUrl = async (
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> => {
    return this.handleRequest(httpRequest, async (request) => {
      const validatedData = generatePresignedUrlSchema.parse(request.body);
      const { fileName, fileType, uploadType, metadata } = validatedData;

      const uploadParams = await this._storageService.generateUploadParams(
        fileName,
        fileType,
        uploadType,
        metadata
      );

      return this.success_200(
        uploadParams,
        "Upload parameters generated successfully"
      );
    });
  };

  // Returns a short-lived signed GET URL for a provided storage key or URL
  getPresignedGetUrl = async (
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> => {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = getPresignedGetUrlSchema.parse(request.query);
      const signedUrl = await this._storageService.generateDownloadUrl(
        validated.key,
        validated.expiresInSeconds ?? 60
      );
      return this.success_200({ signedUrl }, "Signed URL generated");
    });
  };
}
