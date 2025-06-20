import { CertificateDTO } from '../../../../domain/dtos/certificate.dto';

export interface IGenerateCertificateRequest {
  userId: string;
  courseId: string;
}

export interface IGenerateCertificateResponse {
  success: boolean;
  certificate?: CertificateDTO;
  error?: string;
}

export interface IGenerateCertificateUseCase {
  execute(request: IGenerateCertificateRequest): Promise<IGenerateCertificateResponse>;
} 