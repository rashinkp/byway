import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { S3ServiceInterface } from "../../../app/providers/s3.service.interface";
import { generatePresignedUrlSchema } from "../../validators/file.validator";
import { ZodError } from "zod";
import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { ApiResponse } from "../interfaces/ApiResponse";

interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}

export class FileController extends BaseController {
  constructor(
    private readonly s3Service: S3ServiceInterface,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  generatePresignedUrl = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    return this.handleRequest(httpRequest, async (request) => {
      const validatedData = generatePresignedUrlSchema.parse(request.body);

      const { uploadUrl, fileUrl } = await this.s3Service.generatePresignedUrl(
        validatedData.fileName,
        validatedData.fileType
      );

      const response: ApiResponse<PresignedUrlResponse> = {
        statusCode: 200,
        success: true,
        message: "Presigned URL generated successfully",
        data: {
          uploadUrl,
          fileUrl,
        },
      };

      return this.success_200(response, "Presigned URL generated successfully");
    });
  };
}
