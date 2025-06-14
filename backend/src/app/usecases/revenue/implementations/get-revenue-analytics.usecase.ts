import { RevenueMetrics } from "../../../../domain/entities/revenue.entity";
import { IRevenueRepository } from "../../../repositories/revenue.repository";
import { IGetRevenueAnalyticsUseCase } from "../interfaces/get-revenue-analytics.usecase";

export class GetRevenueAnalyticsUseCase implements IGetRevenueAnalyticsUseCase {
  constructor(private readonly revenueRepository: IRevenueRepository) {}

  async execute(params: {
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
  }> {
    const [metrics, byCourse, byInstructor, transactionStats] = await Promise.all([
      this.revenueRepository.getRevenueMetrics(params),
      this.revenueRepository.getRevenueByCourse(params),
      this.revenueRepository.getRevenueByInstructor(params),
      this.revenueRepository.getTransactionStats({
        startDate: params.startDate,
        endDate: params.endDate,
      }),
    ]);

    return {
      metrics,
      courseRevenues: byCourse.map(course => ({
        courseId: course.courseId,
        title: course.courseTitle,
        totalRevenue: course.totalRevenue,
        adminShare: course.adminShare,
        netRevenue: course.netRevenue,
        transactionCount: course.enrollmentCount
      })),
      instructorRevenues: byInstructor.map(instructor => ({
        instructorId: instructor.instructorId,
        name: instructor.instructorName,
        totalRevenue: instructor.totalRevenue,
        adminShare: instructor.adminShare,
        netRevenue: instructor.netRevenue,
        courseCount: instructor.courseCount
      })),
      transactionStats,
    };
  }
} 