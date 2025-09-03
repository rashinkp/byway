import { Certificate } from "../../domain/entities/certificate.entity";

export interface CertificateRepositoryInterface {
  create(certificate: Certificate): Promise<Certificate>;
  findById(id: string): Promise<Certificate | null>;
  findByCertificateNumber(
    certificateNumber: string
  ): Promise<Certificate | null>;
  findByUserId(userId: string): Promise<Certificate[]>;
  findByCourseId(courseId: string): Promise<Certificate[]>;
  findByUserIdAndCourseId(
    userId: string,
    courseId: string
  ): Promise<Certificate | null>;
  update(certificate: Certificate): Promise<Certificate>;
  deleteById(id: string): Promise<void>;
  findManyByUserId(options: {
    userId: string;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: string;
    search?: string;
  }): Promise<{
    items: Certificate[];
    total: number;
    hasMore: boolean;
    nextPage?: number;
  }>;
  findExpiredCertificates(): Promise<Certificate[]>;
  findCertificatesByStatus(status: string): Promise<Certificate[]>;
}
