import { IGetCourseRevenueUseCase, GetCourseRevenueParams, GetCourseRevenueResult } from "../interfaces/get-course-revenue.usecase";
import { IRevenueRepository } from "../../../repositories/revenue.repository";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";

export class GetCourseRevenueUseCase implements IGetCourseRevenueUseCase {
  constructor(private readonly revenueRepository: IRevenueRepository) {}

  async execute(params: GetCourseRevenueParams): Promise<GetCourseRevenueResult> {
    const { startDate, endDate, userId, sortBy = "totalRevenue", sortOrder = "desc", search, page = 1, limit = 10 } = params;

    // Get course transactions
    const courseTransactions = await this.revenueRepository.getCourseTransactions({
      startDate,
      endDate,
      type: TransactionType.REVENUE,
      status: TransactionStatus.COMPLETED,
      userId,
    });

    // Get course details
    const courseIds = courseTransactions.map((t) => t.courseId);
    const courseDetails = await this.revenueRepository.getCourseDetails({ courseIds });

    // Get total courses count for pagination
    const total = await this.revenueRepository.getTotalCourses({
      startDate,
      endDate,
      userId,
      search,
    });

    // Combine transaction data with course details
    const courses = courseDetails.map((course) => {
      const transaction = courseTransactions.find((t) => t.courseId === course.id);
      const totalRevenue = transaction?.amount || 0;
      const enrollments = transaction?.count || 0;
      const adminShare = (totalRevenue * course.adminSharePercentage) / 100;
      const netRevenue = totalRevenue - adminShare;

      return {
        courseId: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        creator: course.creator,
        totalRevenue,
        enrollments,
        adminShare,
        netRevenue,
      };
    });

    // Apply sorting
    const sortedCourses = courses.sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "name") {
        return a.title.localeCompare(b.title) * multiplier;
      }
      const aValue = a[sortBy as keyof typeof a] as number;
      const bValue = b[sortBy as keyof typeof b] as number;
      return (aValue - bValue) * multiplier;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedCourses = sortedCourses.slice(startIndex, startIndex + limit);

    return {
      courses: paginatedCourses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
} 