import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IGenerateCertificateUseCase } from "../../../app/usecases/certificate/interfaces/generate-certificate.usecase.interface";
import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { CertificateRepositoryInterface } from "../../../app/repositories/certificate-repository.interface";

export class CertificateController extends BaseController {
  constructor(
    private readonly generateCertificateUseCase: IGenerateCertificateUseCase,
    private readonly certificateRepository: CertificateRepositoryInterface,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  generateCertificate = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    return this.handleRequest(httpRequest, async (request) => {
      const userId = request.user?.id;
      const { courseId } = request.body;
      if (!userId || !courseId) {
        return this.httpErrors.error_400("User ID or Course ID missing");
      }
      const result = await this.generateCertificateUseCase.execute({ userId, courseId });
      if (!result.success) {
        return this.httpErrors.error_400(result.error || "Certificate generation failed");
      }
      return this.success_200(result.certificate, "Certificate generated successfully");
    });
  };

  getCertificate = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    return this.handleRequest(httpRequest, async (request) => {
      const userId = request.user?.id;
      const courseId = request.query?.["courseId"];

      if (!userId || !courseId) {
        return this.httpErrors.error_400("User ID or Course ID missing");
      }

      // Try to fetch certificate
      const certificate = await this.certificateRepository.findByUserIdAndCourseId(userId, courseId as string);

      if (!certificate) {
        return this.httpErrors.error_404("Certificate not found");
      }

      return this.success_200(certificate, "Certificate found");
    });
  };

  listUserCertificates = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    return this.handleRequest(httpRequest, async (request) => {
      const userId = request.user?.id;
      if (!userId) {
        return this.httpErrors.error_400("User ID missing");
      }
      // Get pagination and filter params
      const page = parseInt(request.query?.["page"] as string) || 1;
      const limit = parseInt(request.query?.["limit"] as string) || 10;
      const sortBy = (request.query?.["sortBy"] as string) || "createdAt";
      const sortOrder = (request.query?.["sortOrder"] as string) === "asc" ? "asc" : "desc";
      const status = request.query?.["status"] as string | undefined;
      const search = request.query?.["search"] as string | undefined;
      const skip = (page - 1) * limit;
      const result = await this.certificateRepository.findManyByUserId({
        userId,
        skip,
        take: limit,
        sortBy,
        sortOrder,
        status,
        search,
      });
      return this.success_200({
        items: result.items,
        total: result.total,
        page,
        totalPages: Math.ceil(result.total / limit),
        hasMore: result.hasMore,
        nextPage: result.nextPage,
      }, "Certificates found");
    });
  };
} 