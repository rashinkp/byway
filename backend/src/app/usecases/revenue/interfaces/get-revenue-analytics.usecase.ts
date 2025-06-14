import { RevenueMetrics } from "../../../../domain/entities/revenue.entity";


export interface IGetRevenueAnalyticsUseCase {
  execute(params: {
    startDate: Date;
    endDate: Date;
    adminSharePercentage: number;
  }): Promise<{
    metrics: RevenueMetrics;
    courseRevenues: Array<{
      courseId: string;
      title: string;
      totalRevenue: number;
      adminShare: number;
      netRevenue: number;
      transactionCount: number;
    }>;
    instructorRevenues: Array<{
      instructorId: string;
      name: string;
      totalRevenue: number;
      adminShare: number;
      netRevenue: number;
      courseCount: number;
    }>;
    transactionStats: {
      totalTransactions: number;
      successfulTransactions: number;
      failedTransactions: number;
      refundedTransactions: number;
      averageTransactionAmount: number;
    };
  }>;
} 