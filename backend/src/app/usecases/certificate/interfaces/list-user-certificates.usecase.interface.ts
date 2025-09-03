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
    items: any[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
    nextPage: number | null;
  }>;
}
