// Dashboard Types
export interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  inactiveCourses: number;
  pendingCourses: number;
  approvedCourses: number;
  declinedCourses: number;
  publishedCourses: number;
  draftCourses: number;
  archivedCourses: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalInstructors: number;
  activeInstructors: number;
  inactiveInstructors: number;
}

export interface EnrollmentStats {
  totalEnrollments: number;
}

export interface DashboardStats {
  courseStats: CourseStats;
  userStats: UserStats;
  enrollmentStats: EnrollmentStats;
  totalRevenue: number;
}

export interface TopEnrolledCourse {
  courseId: string;
  courseTitle: string;
  instructorName: string;
  enrollmentCount: number;
  revenue: number;
  rating: number;
  reviewCount: number;
}

export interface TopInstructor {
  instructorId: string;
  instructorName: string;
  email: string;
  courseCount: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  isActive: boolean;
}

export interface DashboardResponse {
  stats: DashboardStats;
  topEnrolledCourses: TopEnrolledCourse[];
  topInstructors: TopInstructor[];
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
} 