// ============================================================================
// REVENUE REQUEST DTOs
// ============================================================================

export interface GetRevenueMetricsRequestDto {
  startDate: string;
  endDate: string;
  instructorId?: string;
  courseId?: string;
}

export interface GetRevenueByCourseRequestDto {
  startDate: string;
  endDate: string;
  instructorId?: string;
  page?: number;
  limit?: number;
}

export interface GetRevenueByInstructorRequestDto {
  startDate: string;
  endDate: string;
  page?: number;
  limit?: number;
}

export interface GetRevenueChartRequestDto {
  period: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate: string;
  instructorId?: string;
}

// ============================================================================
// REVENUE RESPONSE DTOs
// ============================================================================

export interface RevenueMetricsResponseDto {
  totalRevenue: number;
  adminShare: number;
  netRevenue: number;
  refundedAmount: number;
  netRevenueAfterRefunds: number;
  period: {
    start: Date;
    end: Date;
  };
  adminSharePercentage: number;
  refundRate: number;
  periodDuration: number;
}

export interface RevenueByCourseResponseDto {
  courseId: string;
  courseTitle: string;
  totalRevenue: number;
  adminShare: number;
  netRevenue: number;
  enrollmentCount: number;
  averageRevenuePerEnrollment: number;
  adminSharePercentage: number;
}

export interface RevenueByInstructorResponseDto {
  instructorId: string;
  instructorName: string;
  totalRevenue: number;
  adminShare: number;
  netRevenue: number;
  courseCount: number;
  averageRevenuePerCourse: number;
  adminSharePercentage: number;
}

export interface RevenueChartDataResponseDto {
  date: string;
  revenue: number;
  orders: number;
  enrollments: number;
}

export interface RevenueSummaryResponseDto {
  totalRevenue: number;
  totalOrders: number;
  totalEnrollments: number;
  averageOrderValue: number;
  refundRate: number;
  growthRate: number;
  topPerformingCourses: RevenueByCourseResponseDto[];
  topPerformingInstructors: RevenueByInstructorResponseDto[];
} 