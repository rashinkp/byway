import { CertificateRepositoryInterface } from "../../app/repositories/certificate-repository.interface";
import { Certificate } from "../../domain/entities/certificate.entity";
import { PrismaClient } from "@prisma/client";

export class PrismaCertificateRepository implements CertificateRepositoryInterface {
  constructor(private readonly prisma: PrismaClient) {}

  async create(certificate: Certificate): Promise<Certificate> {
    const created = await this.prisma.certificate.create({
      data: {
        userId: certificate.userId,
        courseId: certificate.courseId,
        enrollmentId: certificate.enrollmentId,
        certificateNumber: certificate.certificateNumber,
        status: certificate.status,
        issuedAt: certificate.issuedAt,
        expiresAt: certificate.expiresAt,
        pdfUrl: certificate.pdfUrl,
        metadata: certificate.metadata ?? undefined,
        createdAt: certificate.createdAt,
        updatedAt: certificate.updatedAt,
      },
    });
    return Certificate.toDomain(created);
  }

  async findById(id: string): Promise<Certificate | null> {
    const found = await this.prisma.certificate.findUnique({ where: { id } });
    return found ? Certificate.toDomain(found) : null;
  }

  async findByCertificateNumber(
    certificateNumber: string
  ): Promise<Certificate | null> {
    const found = await this.prisma.certificate.findUnique({
      where: { certificateNumber },
    });
    return found ? Certificate.toDomain(found) : null;
  }

  async findByUserId(userId: string): Promise<Certificate[]> {
    const found = await this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return found.map((item) => Certificate.toDomain(item));
  }

  async findByCourseId(courseId: string): Promise<Certificate[]> {
    const found = await this.prisma.certificate.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
    });
    return found.map((item) => Certificate.toDomain(item));
  }

  async findByUserIdAndCourseId(
    userId: string,
    courseId: string
  ): Promise<Certificate | null> {
    const found = await this.prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    return found ? Certificate.toDomain(found) : null;
  }

  async update(certificate: Certificate): Promise<Certificate> {
    const updated = await this.prisma.certificate.update({
      where: { id: certificate.id },
      data: {
        status: certificate.status,
        issuedAt: certificate.issuedAt,
        expiresAt: certificate.expiresAt,
        pdfUrl: certificate.pdfUrl,
        metadata: certificate.metadata ?? undefined,
        updatedAt: certificate.updatedAt,
      },
    });
    return Certificate.toDomain(updated);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.certificate.delete({ where: { id } });
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
    items: { user: {name:string , email:string}; course: {title:string }; }[];
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

    const where: any = { userId };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { certificateNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.certificate.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
        include: {
          course: {
            select: {
              title: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.certificate.count({ where }),
    ]);

    const hasMore = skip + take < total;
    const nextPage = hasMore ? Math.floor(skip / take) + 2 : undefined;

    return {
      items,
      total,
      hasMore,
      nextPage,
    };
  }

  async findExpiredCertificates(): Promise<Certificate[]> {
    const now = new Date();
    const found = await this.prisma.certificate.findMany({
      where: {
        expiresAt: { lt: now },
        status: { not: "EXPIRED" },
      },
    });
    return found.map(item => Certificate.toDomain(item));
  }

  async findCertificatesByStatus(status: string): Promise<Certificate[]> {
    const found = await this.prisma.certificate.findMany({
      where: { status: status as any },
      orderBy: { createdAt: "desc" },
    });
     return found.map((item) => Certificate.toDomain(item));
  }
}
