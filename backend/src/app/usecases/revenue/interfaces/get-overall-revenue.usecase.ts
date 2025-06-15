export interface IGetOverallRevenueUseCase {
  execute(params: {
    startDate: Date;
    endDate: Date;
    userId: string;
  }): Promise<{
    totalRevenue: number;
    refundedAmount: number;
    netRevenue: number;
    period: {
      start: Date;
      end: Date;
    };
  }>;
} 