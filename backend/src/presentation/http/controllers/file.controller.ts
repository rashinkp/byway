import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { S3ServiceInterface } from "../../../app/providers/s3.service.interface";
import { generatePresignedUrlSchema, getPresignedGetUrlSchema } from "../../validators/file.validator";
import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";

export class FileController extends BaseController {
  constructor(
    private readonly s3Service: S3ServiceInterface,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  // Returns a presigned PUT URL for client uploads and the S3 key
  generatePresignedUrl = async (
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> => {
    return this.handleRequest(httpRequest, async (request) => {
      const validatedData = generatePresignedUrlSchema.parse(request.body);
      const { fileName, fileType, uploadType, metadata } = validatedData;

      const key = this.s3Service.generateS3Key(fileName, uploadType, metadata);
      const { uploadUrl } = await this.s3Service.generatePresignedPutUrl(
        key,
        fileType
      );

      return this.success_200(
        { uploadUrl, key },
        "Presigned PUT URL generated successfully"
      );
    });
  };

  // Returns a short-lived presigned GET URL for a provided S3 key
  getPresignedGetUrl = async (
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> => {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = getPresignedGetUrlSchema.parse(request.query);
      const signedUrl = await this.s3Service.generatePresignedGetUrl(
        validated.key,
        validated.expiresInSeconds ?? 60
      );
      return this.success_200({ signedUrl }, "Presigned GET URL generated");
    });
  };
}
