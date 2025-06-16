import { IBaseDashboardStats, IBaseCourseStats } from "../shared/dashboard.dto";

// Instructor-specific dashboard stats
export interface IInstructorDashboardStats extends IBaseDashboardStats {
  totalStudents: number;
  activeCourses: number;
  pendingCourses: number;
  completedCourses: number;
  averageRating: number;
  totalReviews: number;
}

// Instructor's course stats
export interface IInstructorCourseStats extends IBaseCourseStats {
  status: string;
  createdAt: Date;
  lastEnrollmentDate?: Date;
}

// Instructor's student stats
export interface IInstructorStudentStats {
  studentId: string;
  studentName: string;
  email: string;
  enrolledCourses: number;
  lastEnrollmentDate: Date;
  isActive: boolean;
}

// Instructor dashboard response
export interface IInstructorDashboardResponse {
  stats: IInstructorDashboardStats;
  topCourses: IInstructorCourseStats[];
  recentStudents: IInstructorStudentStats[];
  recentEnrollments: {
    courseId: string;
    courseTitle: string;
    studentName: string;
    enrolledAt: Date;
  }[];
}

// Input for instructor dashboard
export interface IGetInstructorDashboardInput {
  instructorId: string;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
} 