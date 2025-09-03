import { IGetCertificateUseCase } from "../interfaces/get-certificate.usecase.interface";
import { CertificateRepositoryInterface } from "../../../repositories/certificate-repository.interface";
import { CertificateDTO } from "../../../dtos/certificate.dto";
import { Certificate } from "../../../../domain/entities/certificate.entity";

export class GetCertificateUseCase implements IGetCertificateUseCase {
  constructor(private _certificateRepository: CertificateRepositoryInterface) {}

  async execute(input: { userId: string; courseId: string }): Promise<CertificateDTO | null> {
    const cert = await this._certificateRepository.findByUserIdAndCourseId(input.userId, input.courseId);
    if (!cert) return null;
    
    // Properly map domain entity to DTO
    return {
      id: cert.id,
      userId: cert.userId,
      courseId: cert.courseId,
      enrollmentId: cert.enrollmentId,
      certificateNumber: cert.certificateNumber,
      status: cert.status,
      issuedAt: cert.issuedAt,
      expiresAt: cert.expiresAt,
      pdfUrl: cert.pdfUrl,
      metadata: cert.metadata,
      createdAt: cert.createdAt,
      updatedAt: cert.updatedAt,
    };
  }
}


