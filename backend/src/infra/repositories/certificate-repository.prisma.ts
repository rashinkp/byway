import { CertificateRepositoryInterface } from "../../app/repositories/certificate-repository.interface";
import { Certificate } from "../../domain/entities/certificate.entity";
import { CertificateDTO } from "../../app/dtos/certificate.dto";
import { PrismaClient } from "@prisma/client";

export class PrismaCertificateRepository
  implements CertificateRepositoryInterface
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(certificate: Certificate): Promise<CertificateDTO> {
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
    return this.toDTO(created);
  }

  async findById(id: string): Promise<CertificateDTO | null> {
    const found = await this.prisma.certificate.findUnique({ where: { id } });
    return found ? this.toDTO(found) : null;
  }

  async findByCertificateNumber(
    certificateNumber: string
  ): Promise<CertificateDTO | null> {
    const found = await this.prisma.certificate.findUnique({
      where: { certificateNumber },
    });
    return found ? this.toDTO(found) : null;
  }

  async findByUserId(userId: string): Promise<CertificateDTO[]> {
    const found = await this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return found.map((item) => this.toDTO(item));
  }

  async findByCourseId(courseId: string): Promise<CertificateDTO[]> {
    const found = await this.prisma.certificate.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
    });
    return found.map((item) => this.toDTO(item));
  }

  async findByUserIdAndCourseId(
    userId: string,
    courseId: string
  ): Promise<CertificateDTO | null> {
    const found = await this.prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    return found ? this.toDTO(found) : null;
  }

  async update(certificate: Certificate): Promise<CertificateDTO> {
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
    return this.toDTO(updated);
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
    items: CertificateDTO[];
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
      items: items.map((item) => this.toDTOWithDetails(item)),
      total,
      hasMore,
      nextPage,
    };
  }

  async findExpiredCertificates(): Promise<CertificateDTO[]> {
    const now = new Date();
    const found = await this.prisma.certificate.findMany({
      where: {
        expiresAt: { lt: now },
        status: { not: "EXPIRED" },
      },
    });
    return found.map((item) => this.toDTO(item));
  }

  async findCertificatesByStatus(status: string): Promise<CertificateDTO[]> {
    const found = await this.prisma.certificate.findMany({
      where: { status: status as any },
      orderBy: { createdAt: "desc" },
    });
    return found.map((item) => this.toDTO(item));
  }

  private toDTO(certificate: any): CertificateDTO {
    return {
      id: certificate.id,
      userId: certificate.userId,
      courseId: certificate.courseId,
      enrollmentId: certificate.enrollmentId,
      certificateNumber: certificate.certificateNumber,
      status: certificate.status,
      issuedAt: certificate.issuedAt?.toISOString() || null,
      expiresAt: certificate.expiresAt?.toISOString() || null,
      pdfUrl: certificate.pdfUrl,
      metadata: certificate.metadata,
      createdAt: certificate.createdAt.toISOString(),
      updatedAt: certificate.updatedAt.toISOString(),
    };
  }

  private toDTOWithDetails(certificate: any): CertificateDTO & {
    courseTitle?: string;
    userName?: string;
    userEmail?: string;
  } {
    return {
      ...this.toDTO(certificate),
      courseTitle: certificate.course?.title,
      userName: certificate.user?.name,
      userEmail: certificate.user?.email,
    };
  }
}
