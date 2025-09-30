export interface IListUserCertificatesUseCase {
  execute(input: {
    userId: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
    search?: string;
  }): Promise<{
    items: Array<{
      id: string
      userId: string
      courseId: string
      enrollmentId: string
    }>;
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
    nextPage: number | null;
  }>;
}
