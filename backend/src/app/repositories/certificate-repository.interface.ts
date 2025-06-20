import { Certificate } from '../../domain/entities/certificate.entity';
import { CertificateDTO } from '../../domain/dtos/certificate.dto';

export interface CertificateRepositoryInterface {
  create(certificate: Certificate): Promise<CertificateDTO>;
  findById(id: string): Promise<CertificateDTO | null>;
  findByCertificateNumber(certificateNumber: string): Promise<CertificateDTO | null>;
  findByUserId(userId: string): Promise<CertificateDTO[]>;
  findByCourseId(courseId: string): Promise<CertificateDTO[]>;
  findByUserIdAndCourseId(userId: string, courseId: string): Promise<CertificateDTO | null>;
  update(certificate: Certificate): Promise<CertificateDTO>;
  deleteById(id: string): Promise<void>;
  findManyByUserId(options: {
    userId: string;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
    search?: string;
  }): Promise<{ items: CertificateDTO[]; total: number; hasMore: boolean; nextPage?: number }>;
  findExpiredCertificates(): Promise<CertificateDTO[]>;
  findCertificatesByStatus(status: string): Promise<CertificateDTO[]>;
} 