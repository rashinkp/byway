// ============================================================================
// DASHBOARD REQUEST DTOs
// ============================================================================

export interface GetAdminDashboardRequestDto {
  startDate?: string;
  endDate?: string;
  period?: "daily" | "weekly" | "monthly" | "yearly";
}

export interface GetInstructorDashboardRequestDto {
  instructorId: string;
  startDate?: string;
  endDate?: string;
  period?: "daily" | "weekly" | "monthly" | "yearly";
}

export interface GetUserDashboardRequestDto {
  userId: string;
}

// ============================================================================
// DASHBOARD RESPONSE DTOs
// ============================================================================

export interface AdminDashboardResponseDto {
  overview: {
    totalUsers: number;
    totalCourses: number;
    totalInstructors: number;
    totalRevenue: number;
    totalOrders: number;
    activeEnrollments: number;
  };
  revenue: {
    total: number;
    monthly: number;
    weekly: number;
    daily: number;
    growth: number;
  };
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    growth: number;
  };
  courses: {
    total: number;
    published: number;
    pending: number;
    approved: number;
    declined: number;
  };
  instructors: {
    total: number;
    active: number;
    pending: number;
    approved: number;
    declined: number;
  };
  recentActivity: {
    recentOrders: any[];
    recentUsers: any[];
    recentCourses: any[];
  };
  charts: {
    revenueChart: any[];
    userGrowthChart: any[];
    courseGrowthChart: any[];
  };
}

export interface InstructorDashboardResponseDto {
  overview: {
    totalCourses: number;
    totalStudents: number;
    totalRevenue: number;
    totalLessons: number;
    averageRating: number;
    totalReviews: number;
  };
  revenue: {
    total: number;
    monthly: number;
    weekly: number;
    daily: number;
    growth: number;
  };
  courses: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    pending: number;
    approved: number;
    declined: number;
  };
  students: {
    total: number;
    active: number;
    newThisMonth: number;
    growth: number;
  };
  recentActivity: {
    recentEnrollments: any[];
    recentReviews: any[];
    recentLessons: any[];
  };
  charts: {
    revenueChart: any[];
    studentGrowthChart: any[];
    coursePerformanceChart: any[];
  };
}

export interface UserDashboardResponseDto {
  overview: {
    enrolledCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalLessonsCompleted: number;
    certificatesEarned: number;
  };
  recentActivity: {
    recentEnrollments: any[];
    recentCompletions: any[];
    recentLessons: any[];
  };
  progress: {
    courseProgress: any[];
    lessonProgress: any[];
  };
  recommendations: {
    recommendedCourses: any[];
    trendingCourses: any[];
  };
} 