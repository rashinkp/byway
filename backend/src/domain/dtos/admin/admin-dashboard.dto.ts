export interface IDashboardStats {
  totalCourses: number;
  disabledCourses: number;
  pendingCourses: number;
  totalInstructors: number;
  activeInstructors: number;
  inactiveInstructors: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalEnrollments: number;
  totalRevenue: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface ITopEnrolledCourse {
  courseId: string;
  courseTitle: string;
  instructorName: string;
  enrollmentCount: number;
  revenue: number;
  rating: number;
  reviewCount: number;
}

export interface ITopInstructor {
  instructorId: string;
  instructorName: string;
  email: string;
  courseCount: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  isActive: boolean;
}

export interface IDashboardResponse {
  stats: IDashboardStats;
  topEnrolledCourses: ITopEnrolledCourse[];
  topInstructors: ITopInstructor[];
}

export interface IGetDashboardInput {
  startDate: Date;
  endDate: Date;
  limit?: number;
} 