import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { S3ServiceInterface } from "../../../app/providers/s3.service.interface";
import { generatePresignedUrlSchema } from "../../validators/file.validator";
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

  generatePresignedUrl = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    return this.handleRequest(httpRequest, async (request) => {
      const validatedData = generatePresignedUrlSchema.parse(request.body);
      const { fileName, fileType } = validatedData;

      const { uploadUrl, fileUrl } = await this.s3Service.generatePresignedUrl(
        fileName,
        fileType
      );

      return this.success_200(
        {
          uploadUrl,
          fileUrl,
        },
        "Presigned URL generated successfully"
      );
    });
  };
}
