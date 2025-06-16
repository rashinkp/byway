// Shared DTOs for dashboard functionality
export interface IBaseCourseStats {
  courseId: string;
  courseTitle: string;
  enrollmentCount: number;
  revenue: number;
  rating: number;
  reviewCount: number;
}

export interface IBaseInstructorStats {
  instructorId: string;
  instructorName: string;
  email: string;
  courseCount: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  isActive: boolean;
}

export interface IBaseDashboardStats {
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  period?: {
    start: Date;
    end: Date;
  };
}

export interface IBaseDashboardResponse {
  stats: IBaseDashboardStats;
  topCourses: IBaseCourseStats[];
} 