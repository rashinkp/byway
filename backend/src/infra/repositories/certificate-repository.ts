import { CertificateRepositoryInterface } from "../../app/repositories/certificate-repository.interface";
import { Certificate, CertificateMetadata } from "../../domain/entities/certificate.entity";
import { PrismaClient } from "@prisma/client";
import { CertificateStatus } from "../../domain/enum/certificate-status.enum";

// Type for Prisma JSON operations
type PrismaJsonValue = string | number | boolean | null | PrismaJsonValue[] | { [key: string]: PrismaJsonValue };

export class PrismaCertificateRepository implements CertificateRepositoryInterface {
  constructor(private readonly _prisma: PrismaClient) {}

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
        metadata: certificate.metadata as PrismaJsonValue ?? undefined,
        createdAt: certificate.createdAt,
        updatedAt: certificate.updatedAt,
      },
    });
    return Certificate.fromPersistence({
      ...created,
      metadata: created.metadata as CertificateMetadata | undefined
    });
  }

  async findById(id: string): Promise<Certificate | null> {
    const found = await this._prisma.certificate.findUnique({ where: { id } });
    return found ? Certificate.fromPersistence({
      ...found,
      metadata: found.metadata as CertificateMetadata | undefined
    }) : null;
  }

  async findByCertificateNumber(
    certificateNumber: string
  ): Promise<Certificate | null> {
    const found = await this._prisma.certificate.findUnique({
      where: { certificateNumber },
    });
    return found ? Certificate.fromPersistence({
      ...found,
      metadata: found.metadata as CertificateMetadata | undefined
    }) : null;
  }

  async findByUserId(userId: string): Promise<Certificate[]> {
    const found = await this._prisma.certificate.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return found.map((item) => Certificate.fromPersistence({
      ...item,
      metadata: item.metadata as CertificateMetadata | undefined
    }));
  }

  async findByCourseId(courseId: string): Promise<Certificate[]> {
    const found = await this._prisma.certificate.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
    });
    return found.map((item) => Certificate.fromPersistence({
      ...item,
      metadata: item.metadata as CertificateMetadata | undefined
    }));
  }

  async findByUserIdAndCourseId(
    userId: string,
    courseId: string
  ): Promise<Certificate | null> {
    const found = await this._prisma.certificate.findFirst({
      where: { userId, courseId },
    });
    return found ? Certificate.fromPersistence({
      ...found,
      metadata: found.metadata as CertificateMetadata | undefined
    }) : null;
  }

  async update(certificate: Certificate): Promise<Certificate> {
    const updated = await this._prisma.certificate.update({
      where: { id: certificate.id },
      data: {
        status: certificate.status,
        issuedAt: certificate.issuedAt,
        expiresAt: certificate.expiresAt,
        pdfUrl: certificate.pdfUrl,
        metadata: certificate.metadata as PrismaJsonValue ?? undefined,
        updatedAt: certificate.updatedAt,
      },
    });
    return Certificate.fromPersistence({
      ...updated,
      metadata: updated.metadata as CertificateMetadata | undefined
    });
  }

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
    items: Certificate[];
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

    const [rawItems, total] = await Promise.all([
      this._prisma.certificate.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
      }),
      this._prisma.certificate.count({ where }),
    ]);

    const hasMore = skip + take < total;
    const nextPage = hasMore ? Math.floor(skip / take) + 2 : undefined;

    // Map raw database results to domain entities
    const items = rawItems.map(item => Certificate.fromPersistence({
      ...item,
      metadata: item.metadata as CertificateMetadata | undefined
    }));

    return {
      items,
      total,
      hasMore,
      nextPage,
    };
  }

  async findExpiredCertificates(): Promise<Certificate[]> {
    const now = new Date();
    const found = await this._prisma.certificate.findMany({
      where: {
        expiresAt: { lt: now },
        status: { not: "EXPIRED" },
      },
    });
    return found.map(item => Certificate.fromPersistence({
      ...item,
      metadata: item.metadata as CertificateMetadata | undefined
    }));
  }

  async findCertificatesByStatus(status: string): Promise<Certificate[]> {
    const found = await this._prisma.certificate.findMany({
      where: { status: status as CertificateStatus },
      orderBy: { createdAt: "desc" },
    });
     return found.map((item) => Certificate.fromPersistence({
      ...item,
      metadata: item.metadata as CertificateMetadata | undefined
    }));
  }
}
