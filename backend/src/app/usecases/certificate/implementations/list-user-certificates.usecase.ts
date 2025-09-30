import { IListUserCertificatesUseCase } from "../interfaces/list-user-certificates.usecase.interface";
import { CertificateRepositoryInterface } from "../../../repositories/certificate-repository.interface";

export class ListUserCertificatesUseCase implements IListUserCertificatesUseCase {
  constructor(private _certificateRepository: CertificateRepositoryInterface) {}

  async execute(input: {
    userId: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
    search?: string;
  }): Promise<{
    items: Array<{
      id: string;
      userId: string
      courseId: string
      enrollmentId: string
      certificateNumber: string
      status: string
    }>;
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
    nextPage: number | null;
  }> {

    const page = input.page || 1;
    const limit = input.limit || 10;
    const sortBy = input.sortBy || "createdAt";
    const sortOrder = input.sortOrder === "asc" ? "asc" : "desc";
    const skip = (page - 1) * limit;

    const result = await this._certificateRepository.findManyByUserId({
      userId: input.userId,
      skip,
      take: limit,
      sortBy,
      sortOrder,
      status: input.status,
      search: input.search,
    });

    const items = result.items.map(certificate => ({
      id: certificate.id,
      userId: certificate.userId,
      courseId: certificate.courseId,
      enrollmentId: certificate.enrollmentId,
      certificateNumber: certificate.certificateNumber,
      status: certificate.status,
      issuedAt: certificate.issuedAt,
      expiresAt: certificate.expiresAt,
      pdfUrl: certificate.pdfUrl,
      metadata: certificate.metadata,
      createdAt: certificate.createdAt,
      updatedAt: certificate.updatedAt,
    }));

    return {
      items,
      total: result.total,
      page,
      totalPages: Math.ceil(result.total / limit),
      hasMore: result.hasMore,
      nextPage: result.nextPage ?? null,
    };
  }
}
