import { CertificateRepositoryInterface } from "../../app/repositories/certificate-repository.interface";
import {
  Certificate,
  CertificateMetadata,
} from "../../domain/entities/certificate.entity";
import { PrismaClient } from "@prisma/client";
import { CertificateStatus } from "../../domain/enum/certificate-status.enum";
import { GenericRepository } from "./generic.repository";

// Type for Prisma JSON operations
type PrismaJsonValue =
  | string
  | number
  | boolean
  | null
  | PrismaJsonValue[]
  | { [key: string]: PrismaJsonValue };

export class PrismaCertificateRepository
  extends GenericRepository<Certificate>
  implements CertificateRepositoryInterface
{
  constructor(private readonly _prisma: PrismaClient) {
    super(_prisma, "certificate");
  }

  protected getPrismaModel() {
    return this._prisma.certificate;
  }

  protected mapToEntity(certificate: any): Certificate {
    return Certificate.fromPersistence({
      ...certificate,
      metadata: certificate.metadata as CertificateMetadata | undefined,
    });
  }

  protected mapToPrismaData(entity: any): any {
    if (entity instanceof Certificate) {
      return {
        userId: entity.userId,
        courseId: entity.courseId,
        enrollmentId: entity.enrollmentId,
        certificateNumber: entity.certificateNumber,
        status: entity.status,
        issuedAt: entity.issuedAt,
        expiresAt: entity.expiresAt,
        pdfUrl: entity.pdfUrl,
        metadata: (entity.metadata as PrismaJsonValue) ?? undefined,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      };
    }
    return entity;
  }

  // Generic repository methods
  async create(certificate: Certificate): Promise<Certificate> {
    const created = await this._prisma.certificate.create({
      data: {
        userId: certificate.userId,
        courseId: certificate.courseId,
        enrollmentId: certificate.enrollmentId,
        certificateNumber: certificate.certificateNumber,
        status: certificate.status,
        issuedAt: certificate.issuedAt,
        expiresAt: certificate.expiresAt,
        pdfUrl: certificate.pdfUrl,
        metadata: (certificate.metadata as PrismaJsonValue) ?? undefined,
        createdAt: certificate.createdAt,
        updatedAt: certificate.updatedAt,
      },
    });
    return Certificate.fromPersistence({
      ...created,
      metadata: created.metadata as CertificateMetadata | undefined,
    });
  }

  async findById(id: string): Promise<Certificate | null> {
    return this.findByIdGeneric(id);
  }

  async find(filter?: any): Promise<Certificate[]> {
    return this.findGeneric(filter);
  }

  async update(id: string, certificate: Certificate): Promise<Certificate> {
    return this.updateGeneric(id, certificate);
  }

  async delete(id: string): Promise<void> {
    return this.deleteGeneric(id);
  }

  async softDelete(id: string): Promise<Certificate> {
    // No deletedAt in Certificate; update timestamp and return
    const updated = await this._prisma.certificate.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
    return this.mapToEntity(updated);
  }

  async count(filter?: any): Promise<number> {
    return this.countGeneric(filter);
  }

  async findByCertificateNumber(
    certificateNumber: string
  ): Promise<Certificate | null> {
    const found = await this._prisma.certificate.findUnique({
      where: { certificateNumber },
    });
    return found
      ? Certificate.fromPersistence({
          ...found,
          metadata: found.metadata as CertificateMetadata | undefined,
        })
      : null;
  }

  async findByUserId(userId: string): Promise<Certificate[]> {
    const found = await this._prisma.certificate.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return found.map((item) => this.mapToEntity(item));
  }

  async findByCourseId(courseId: string): Promise<Certificate[]> {
    const found = await this._prisma.certificate.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
    });
    return found.map((item) => this.mapToEntity(item));
  }

  async findByUserIdAndCourseId(
    userId: string,
    courseId: string
  ): Promise<Certificate | null> {
    const found = await this._prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    return found
      ? Certificate.fromPersistence({
          ...found,
          metadata: found.metadata as CertificateMetadata | undefined,
        })
      : null;
  }

  // Legacy method kept for interface
  async deleteById(id: string): Promise<void> {
    await this._prisma.certificate.delete({ where: { id } });
  }

  async findManyByUserId(options: {
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
  }> {
    const {
      userId,
      skip = 0,
      take = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      status,
      search,
    } = options;

    const where: Record<string, unknown> = { userId };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { certificateNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      this._prisma.certificate.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
        include: {
          course: { select: { title: true } },
          user: { select: { name: true, email: true } },
        },
      }),
      this._prisma.certificate.count({ where }),
    ]);

    const hasMore = skip + take < total;
    const nextPage = hasMore ? Math.floor(skip / take) + 2 : undefined;

    return { items, total, hasMore, nextPage };
  }

  async findExpiredCertificates(): Promise<Certificate[]> {
    const now = new Date();
    const found = await this._prisma.certificate.findMany({
      where: { expiresAt: { lt: now }, status: { not: "EXPIRED" } },
    });
    return found.map((item) =>
      Certificate.fromPersistence({
        ...item,
        metadata: item.metadata as CertificateMetadata | undefined,
      })
    );
  }

  async findCertificatesByStatus(status: string): Promise<Certificate[]> {
    const found = await this._prisma.certificate.findMany({
      where: { status: status as CertificateStatus },
      orderBy: { createdAt: "desc" },
    });
    return found.map((item) =>
      Certificate.fromPersistence({
        ...item,
        metadata: item.metadata as CertificateMetadata | undefined,
      })
    );
  }
}
