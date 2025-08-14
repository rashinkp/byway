import { CourseStats } from "../../domain/types/course-stats.interface";

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





export interface InstructorStatsDTO {
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
  topInstructors?: InstructorStatsDTO[];
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
