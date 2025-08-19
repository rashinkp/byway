import { Certificate } from "../../domain/entities/certificate.entity";
import { Course } from "../../domain/entities/course.entity";
import { User } from "../../domain/entities/user.entity";
import { IGenericRepository } from "./generic-repository.interface";

export interface CertificateRepositoryInterface
  extends IGenericRepository<Certificate> {
  findByCertificateNumber(
    certificateNumber: string
  ): Promise<Certificate | null>;
  findByUserId(userId: string): Promise<Certificate[]>;
  findByCourseId(courseId: string): Promise<Certificate[]>;
  findByUserIdAndCourseId(
    userId: string,
    courseId: string
  ): Promise<Certificate | null>;
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
    items: {
      user: { name: string; email: string };
      course: { title: string };
    }[];
    total: number;
    hasMore: boolean;
    nextPage?: number;
  }>;
  findExpiredCertificates(): Promise<Certificate[]>;
  findCertificatesByStatus(status: string): Promise<Certificate[]>;
}
