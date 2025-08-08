export interface Period {
  start: Date;
  end: Date;
}

export interface Person {
  id: string;
  name: string;
  email?: string;
  isActive?: boolean;
}



export interface CourseStats {
  courseId: string;
  courseTitle: string;
  instructorName?: string;
  enrollmentCount: number;
  revenue: number;
  rating: number;
  reviewCount: number;
  status?: string; // For instructor-specific stats
  createdAt?: Date;
  lastEnrollmentDate?: Date;
}

export interface InstructorStats {
  instructorId: string;
  instructorName: string;
  email: string;
  courseCount: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  isActive: boolean;
}


export interface StudentStats {
  studentId: string;
  studentName: string;
  email?: string;
  enrolledCourses: number;
  lastEnrollmentDate?: Date;
  isActive?: boolean;
}


export interface DashboardStats {
  // General stats
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;

  // Optional extended stats
  disabledCourses?: number;
  pendingCourses?: number;
  activeCourses?: number;
  completedCourses?: number;

  totalInstructors?: number;
  activeInstructors?: number;
  inactiveInstructors?: number;

  totalUsers?: number;
  activeUsers?: number;
  inactiveUsers?: number;

  totalStudents?: number;
  averageRating?: number;
  totalReviews?: number;

  // Date range
  period?: Period;
}



export interface DashboardResponse {
  stats: DashboardStats;
  topCourses?: CourseStats[];
  topInstructors?: InstructorStats[];
  topStudents?: StudentStats[];
}



export interface InstructorDashboardResponse extends DashboardResponse {
  topCourses?: CourseStats[]; // can include status, dates
  recentStudents?: StudentStats[];
  recentEnrollments?: {
    courseId: string;
    courseTitle: string;
    studentName: string;
    enrolledAt: Date;
  }[];
}


export interface DashboardInput {
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  instructorId: string; // null for general dashboard
}
