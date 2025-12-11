import { SharedDependencies } from "./shared.dependencies";
import { CertificatePdfService } from "../infra/providers/certificate/certificate-pdf.service";
import { GenerateCertificateUseCase } from "../app/usecases/certificate/implementations/generate-certificate.usecase";
import { CertificateRepositoryInterface } from "../app/repositories/certificate-repository.interface";
import { IEnrollmentRepository } from "../app/repositories/enrollment.repository.interface";
import { ICourseRepository } from "../app/repositories/course.repository.interface";
import { IUserRepository } from "../app/repositories/user.repository";
import { ILessonProgressRepository } from "../app/repositories/lesson-progress.repository.interface";
import { CertificateController } from "../presentation/http/controllers/certificate.controller";
import { CertificatePdfServiceInterface } from "../app/providers/generate-certificate.interface";
import { ILessonRepository } from "../app/repositories/lesson.repository";
import { GetCertificateUseCase } from "../app/usecases/certificate/implementations/get-certificate.usecase";
import { IGetCertificateUseCase } from "../app/usecases/certificate/interfaces/get-certificate.usecase.interface";
import { ListUserCertificatesUseCase } from "../app/usecases/certificate/implementations/list-user-certificates.usecase";
import { IListUserCertificatesUseCase } from "../app/usecases/certificate/interfaces/list-user-certificates.usecase.interface";

export interface CertificateDependencies {
  generateCertificateUseCase: GenerateCertificateUseCase;
  getCertificateUseCase: IGetCertificateUseCase;
  listUserCertificatesUseCase: IListUserCertificatesUseCase;
  certificateController: CertificateController;
}

export function createCertificateDependencies(
  sharedDeps: SharedDependencies,
  certificateRepository: CertificateRepositoryInterface,
  enrollmentRepository: IEnrollmentRepository,
  courseRepository: ICourseRepository,
  userRepository: IUserRepository,
  lessonProgressRepository: ILessonProgressRepository,
  lessonRepository: ILessonRepository
): CertificateDependencies {
  const certificatePdfService = new CertificatePdfService() as unknown as CertificatePdfServiceInterface;

  const generateCertificateUseCase = new GenerateCertificateUseCase(
    certificateRepository,
    enrollmentRepository,
    courseRepository,
    userRepository,
    lessonProgressRepository,
    lessonRepository,
    certificatePdfService,
    sharedDeps.fileStorageService
  );

  const getCertificateUseCase: IGetCertificateUseCase = new GetCertificateUseCase(certificateRepository);

  const listUserCertificatesUseCase: IListUserCertificatesUseCase = new ListUserCertificatesUseCase(certificateRepository);

  // Create controller
  const certificateController = new CertificateController(
    generateCertificateUseCase,
    getCertificateUseCase,
    listUserCertificatesUseCase,
    sharedDeps.httpErrors,
    sharedDeps.httpSuccess,
  );

  return {
    generateCertificateUseCase,
    getCertificateUseCase,
    listUserCertificatesUseCase,
    certificateController,
  };
}
