import { TransactionHistoryRecord } from "../records/transaction-history.record";

export interface IRevenueRepository {
  getRevenueStats(options: { userId?: string; startDate?: Date; endDate?: Date }): Promise<{
    totalRevenue: number;
    monthlyRevenue: { month: string; revenue: number }[];
    topCourses: { courseId: string; title: string; revenue: number }[];
  }>;
  getInstructorRevenue(options: { userId: string; startDate?: Date; endDate?: Date }): Promise<{
    totalRevenue: number;
    courseRevenue: { courseId: string; title: string; revenue: number }[];
    monthlyRevenue: { month: string; revenue: number }[];
  }>;
  getAdminRevenue(options: { startDate?: Date; endDate?: Date }): Promise<{
    totalRevenue: number;
    instructorRevenue: { instructorId: string; name: string; revenue: number }[];
    monthlyRevenue: { month: string; revenue: number }[];
  }>;
  getTotalRevenue(userId: string): Promise<number>;
}
