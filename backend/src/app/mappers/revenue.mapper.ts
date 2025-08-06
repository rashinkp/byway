import { Revenue } from "../../domain/entities/revenue.entity";
import { Course } from "../../domain/entities/course.entity";
import { Instructor } from "../../domain/entities/instructor.entity";
import { User } from "../../domain/entities/user.entity";
import {
  GetRevenueMetricsRequestDto,
  GetRevenueByCourseRequestDto,
  GetRevenueByInstructorRequestDto,
  GetRevenueChartRequestDto,
  RevenueMetricsResponseDto,
  RevenueByCourseResponseDto,
  RevenueByInstructorResponseDto,
  RevenueChartDataResponseDto,
  RevenueSummaryResponseDto,
} from "../dtos/revenue.dto";

export class RevenueMapper {
  // Domain Entity to Response DTOs
  static toRevenueMetricsResponseDto(
    revenue: Revenue,
    additionalData?: {
      previousPeriodRevenue?: number;
      growthPercentage?: number;
      refundAmount?: number;
      netRevenue?: number;
    }
  ): RevenueMetricsResponseDto {
    return {
      totalRevenue: revenue.totalRevenue,
      adminShare: revenue.totalRevenue * (revenue.getAdminSharePercentage() / 100),
      instructorShare: revenue.totalRevenue * ((100 - revenue.getAdminSharePercentage()) / 100),
      totalEnrollments: revenue.totalEnrollments,
      totalCourses: revenue.totalCourses,
      averageRevenuePerCourse: revenue.getAverageRevenuePerCourse(),
      averageRevenuePerEnrollment: revenue.getAverageRevenuePerEnrollment(),
      adminSharePercentage: revenue.getAdminSharePercentage(),
      refundRate: revenue.getRefundRate(),
      periodStart: revenue.periodStart,
      periodEnd: revenue.periodEnd,
      periodDuration: revenue.getPeriodDuration(),
      ...additionalData,
    };
  }

  static toRevenueByCourseResponseDto(
    course: Course,
    revenueData: {
      totalRevenue: number;
      adminShare: number;
      instructorShare: number;
      totalEnrollments: number;
      averageRating: number;
      totalReviews: number;
      refundAmount: number;
      netRevenue: number;
    },
    instructor?: { name: string; email: string }
  ): RevenueByCourseResponseDto {
    return {
      courseId: course.id,
      courseName: course.title,
      courseDescription: course.description,
      courseThumbnail: course.thumbnail,
      coursePrice: course.price,
      courseFinalPrice: course.getFinalPrice(),
      courseLevel: course.level,
      courseStatus: course.status,
      approvalStatus: course.approvalStatus,
      createdBy: course.createdBy,
      instructorName: instructor?.name,
      instructorEmail: instructor?.email,
      totalRevenue: revenueData.totalRevenue,
      adminShare: revenueData.adminShare,
      instructorShare: revenueData.instructorShare,
      adminSharePercentage: course.adminSharePercentage,
      instructorSharePercentage: 100 - course.adminSharePercentage,
      totalEnrollments: revenueData.totalEnrollments,
      averageRating: revenueData.averageRating,
      totalReviews: revenueData.totalReviews,
      refundAmount: revenueData.refundAmount,
      netRevenue: revenueData.netRevenue,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }

  static toRevenueByInstructorResponseDto(
    instructor: Instructor,
    user: User,
    revenueData: {
      totalRevenue: number;
      adminShare: number;
      instructorShare: number;
      totalCourses: number;
      totalEnrollments: number;
      averageRating: number;
      totalReviews: number;
      refundAmount: number;
      netRevenue: number;
    }
  ): RevenueByInstructorResponseDto {
    return {
      instructorId: instructor.id,
      userId: instructor.userId,
      instructorName: user.name,
      instructorEmail: user.email.address,
      instructorAvatar: user.avatar,
      instructorBio: instructor.bio,
      instructorExpertise: instructor.expertise,
      instructorStatus: instructor.status,
      isActive: instructor.isActive(),
      isApproved: instructor.isApproved(),
      totalRevenue: revenueData.totalRevenue,
      adminShare: revenueData.adminShare,
      instructorShare: revenueData.instructorShare,
      totalCourses: revenueData.totalCourses,
      totalEnrollments: revenueData.totalEnrollments,
      averageRevenuePerCourse: revenueData.totalCourses > 0 ? revenueData.totalRevenue / revenueData.totalCourses : 0,
      averageRevenuePerEnrollment: revenueData.totalEnrollments > 0 ? revenueData.totalRevenue / revenueData.totalEnrollments : 0,
      averageRating: revenueData.averageRating,
      totalReviews: revenueData.totalReviews,
      refundAmount: revenueData.refundAmount,
      netRevenue: revenueData.netRevenue,
      createdAt: instructor.createdAt,
      updatedAt: instructor.updatedAt,
    };
  }

  static toRevenueChartDataResponseDto(
    chartData: Array<{
      date: string;
      totalRevenue: number;
      adminShare: number;
      instructorShare: number;
      enrollments: number;
      refunds: number;
      netRevenue: number;
    }>
  ): RevenueChartDataResponseDto {
    return {
      chartData,
      totalDataPoints: chartData.length,
      dateRange: {
        start: chartData.length > 0 ? chartData[0].date : '',
        end: chartData.length > 0 ? chartData[chartData.length - 1].date : '',
      },
      summary: {
        totalRevenue: chartData.reduce((sum, item) => sum + item.totalRevenue, 0),
        totalAdminShare: chartData.reduce((sum, item) => sum + item.adminShare, 0),
        totalInstructorShare: chartData.reduce((sum, item) => sum + item.instructorShare, 0),
        totalEnrollments: chartData.reduce((sum, item) => sum + item.enrollments, 0),
        totalRefunds: chartData.reduce((sum, item) => sum + item.refunds, 0),
        totalNetRevenue: chartData.reduce((sum, item) => sum + item.netRevenue, 0),
      },
    };
  }

  static toRevenueSummaryResponseDto(
    summaryData: {
      totalRevenue: number;
      adminTotalShare: number;
      instructorTotalShare: number;
      totalEnrollments: number;
      totalCourses: number;
      totalInstructors: number;
      totalRefunds: number;
      netRevenue: number;
      averageOrderValue: number;
      conversionRate: number;
      topPerformingCourse: {
        id: string;
        name: string;
        revenue: number;
      };
      topPerformingInstructor: {
        id: string;
        name: string;
        revenue: number;
      };
    }
  ): RevenueSummaryResponseDto {
    return {
      totalRevenue: summaryData.totalRevenue,
      adminTotalShare: summaryData.adminTotalShare,
      instructorTotalShare: summaryData.instructorTotalShare,
      totalEnrollments: summaryData.totalEnrollments,
      totalCourses: summaryData.totalCourses,
      totalInstructors: summaryData.totalInstructors,
      totalRefunds: summaryData.totalRefunds,
      netRevenue: summaryData.netRevenue,
      averageOrderValue: summaryData.averageOrderValue,
      conversionRate: summaryData.conversionRate,
      topPerformingCourse: summaryData.topPerformingCourse,
      topPerformingInstructor: summaryData.topPerformingInstructor,
    };
  }
}