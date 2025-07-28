import { SharedDependencies } from "./shared.dependencies";
import { CertificatePdfService } from "../infra/providers/certificate/certificate-pdf.service";
import { GenerateCertificateUseCase } from "../app/usecases/certificate/implementations/generate-certificate.usecase";
import { CertificateRepositoryInterface } from "../app/repositories/certificate-repository.interface";
import { IEnrollmentRepository } from "../app/repositories/enrollment.repository.interface";
import { ICourseRepository } from "../app/repositories/course.repository.interface";
import { IUserRepository } from "../app/repositories/user.repository";
import { ILessonProgressRepository } from "../app/repositories/lesson-progress.repository.interface";
import { CertificateController } from "../presentation/http/controllers/certificate.controller";

export interface CertificateDependencies {
  generateCertificateUseCase: GenerateCertificateUseCase;
  certificateController: CertificateController;
}

export function createCertificateDependencies(
  sharedDeps: SharedDependencies,
  certificateRepository: CertificateRepositoryInterface,
  enrollmentRepository: IEnrollmentRepository,
  courseRepository: ICourseRepository,
  userRepository: IUserRepository,
  lessonProgressRepository: ILessonProgressRepository
): CertificateDependencies {
  // Create infrastructure services
  const certificatePdfService = new CertificatePdfService();
  
  // Create use case
  const generateCertificateUseCase = new GenerateCertificateUseCase(
    certificateRepository,
    enrollmentRepository,
    courseRepository,
    userRepository,
    lessonProgressRepository,
    certificatePdfService,
    sharedDeps.s3Service
  );

  // Create controller
  const certificateController = new CertificateController(
    generateCertificateUseCase,
    certificateRepository,
    sharedDeps.httpErrors,
    sharedDeps.httpSuccess
  );

  return {
    generateCertificateUseCase,
    certificateController,
  };
} 