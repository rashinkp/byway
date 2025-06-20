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
      const certificates = await this.certificateRepository.findByUserId(userId);
      if (!certificates || certificates.length === 0) {
        return this.httpErrors.error_404("No certificates found for this user");
      }
      return this.success_200(certificates, "Certificates found");
    });
  };
} 