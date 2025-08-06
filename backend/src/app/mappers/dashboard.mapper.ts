import {
  GetAdminDashboardRequestDto,
  GetInstructorDashboardRequestDto,
  GetUserDashboardRequestDto,
  AdminDashboardResponseDto,
  InstructorDashboardResponseDto,
  UserDashboardResponseDto,
} from "../dtos/dashboard.dto";

export class DashboardMapper {
  // Static methods to create response DTOs
  static toAdminDashboardResponseDto(data: {
    totalUsers: number;
    totalInstructors: number;
    totalCourses: number;
    totalRevenue: number;
    totalOrders: number;
    activeUsers: number;
    pendingInstructors: number;
    approvedCourses: number;
    pendingCourses: number;
    declinedCourses: number;
    recentUsers: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: Date;
    }>;
    recentOrders: Array<{
      id: string;
      userId: string;
      userName: string;
      total: number;
      status: string;
      createdAt: Date;
    }>;
    revenueChart: Array<{
      date: string;
      revenue: number;
      orders: number;
    }>;
    topCourses: Array<{
      id: string;
      title: string;
      enrollments: number;
      revenue: number;
      rating: number;
    }>;
    topInstructors: Array<{
      id: string;
      name: string;
      courses: number;
      students: number;
      revenue: number;
      rating: number;
    }>;
  }): AdminDashboardResponseDto {
    return {
      totalUsers: data.totalUsers,
      totalInstructors: data.totalInstructors,
      totalCourses: data.totalCourses,
      totalRevenue: data.totalRevenue,
      totalOrders: data.totalOrders,
      activeUsers: data.activeUsers,
      pendingInstructors: data.pendingInstructors,
      approvedCourses: data.approvedCourses,
      pendingCourses: data.pendingCourses,
      declinedCourses: data.declinedCourses,
      recentUsers: data.recentUsers,
      recentOrders: data.recentOrders,
      revenueChart: data.revenueChart,
      topCourses: data.topCourses,
      topInstructors: data.topInstructors,
    };
  }

  static toInstructorDashboardResponseDto(data: {
    totalCourses: number;
    totalStudents: number;
    totalRevenue: number;
    totalReviews: number;
    averageRating: number;
    publishedCourses: number;
    pendingCourses: number;
    declinedCourses: number;
    recentEnrollments: Array<{
      id: string;
      courseName: string;
      studentName: string;
      enrolledAt: Date;
    }>;
    recentReviews: Array<{
      id: string;
      courseName: string;
      studentName: string;
      rating: number;
      comment: string;
      createdAt: Date;
    }>;
    revenueChart: Array<{
      date: string;
      revenue: number;
      enrollments: number;
    }>;
    topCourses: Array<{
      id: string;
      title: string;
      enrollments: number;
      revenue: number;
      rating: number;
    }>;
  }): InstructorDashboardResponseDto {
    return {
      totalCourses: data.totalCourses,
      totalStudents: data.totalStudents,
      totalRevenue: data.totalRevenue,
      totalReviews: data.totalReviews,
      averageRating: data.averageRating,
      publishedCourses: data.publishedCourses,
      pendingCourses: data.pendingCourses,
      declinedCourses: data.declinedCourses,
      recentEnrollments: data.recentEnrollments,
      recentReviews: data.recentReviews,
      revenueChart: data.revenueChart,
      topCourses: data.topCourses,
    };
  }

  static toUserDashboardResponseDto(data: {
    totalEnrollments: number;
    completedCourses: number;
    inProgressCourses: number;
    totalCertificates: number;
    totalSpent: number;
    averageProgress: number;
    recentEnrollments: Array<{
      id: string;
      courseName: string;
      instructorName: string;
      progress: number;
      enrolledAt: Date;
    }>;
    recentCertificates: Array<{
      id: string;
      courseName: string;
      instructorName: string;
      issuedAt: Date;
    }>;
    progressChart: Array<{
      date: string;
      completedLessons: number;
      totalLessons: number;
    }>;
    upcomingDeadlines: Array<{
      courseId: string;
      courseName: string;
      deadline: Date;
      type: string;
    }>;
  }): UserDashboardResponseDto {
    return {
      totalEnrollments: data.totalEnrollments,
      completedCourses: data.completedCourses,
      inProgressCourses: data.inProgressCourses,
      totalCertificates: data.totalCertificates,
      totalSpent: data.totalSpent,
      averageProgress: data.averageProgress,
      recentEnrollments: data.recentEnrollments,
      recentCertificates: data.recentCertificates,
      progressChart: data.progressChart,
      upcomingDeadlines: data.upcomingDeadlines,
    };
  }
}