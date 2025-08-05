import { CertificateRecord } from "../records/certificate.record";

export interface CertificateRepositoryInterface {
  create(certificate: CertificateRecord): Promise<CertificateRecord>;
  findById(id: string): Promise<CertificateRecord | null>;
  findByUserId(userId: string): Promise<CertificateRecord[]>;
  findByCourseId(courseId: string): Promise<CertificateRecord[]>;
  findByEnrollmentId(enrollmentId: string): Promise<CertificateRecord | null>;
  update(certificate: CertificateRecord): Promise<CertificateRecord>;
  delete(id: string): Promise<void>;
  findByCertificateNumber(certificateNumber: string): Promise<CertificateRecord | null>;
  findCertificatesByStatus(status: string): Promise<CertificateRecord[]>;
}
