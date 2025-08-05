import { CertificateRecord } from "../records/certificate.record";

export interface CertificateRepositoryInterface {
  create(certificate: CertificateRecord): Promise<CertificateRecord>;
  findById(id: string): Promise<CertificateRecord | null>;
  findByCertificateNumber(certificateNumber: string): Promise<CertificateRecord | null>;
  findByUserId(userId: string): Promise<CertificateRecord[]>;
  findByCourseId(courseId: string): Promise<CertificateRecord[]>;
  findByUserIdAndCourseId(userId: string, courseId: string): Promise<CertificateRecord | null>;
  update(certificate: CertificateRecord): Promise<CertificateRecord>;
  deleteById(id: string): Promise<void>;
  findManyByUserId(options: {
    userId: string;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: string;
    search?: string;
  }): Promise<{ items: CertificateRecord[]; total: number; hasMore: boolean; nextPage?: number }>;
  findExpiredCertificates(): Promise<CertificateRecord[]>;
  findCertificatesByStatus(status: string): Promise<CertificateRecord[]>;
}
