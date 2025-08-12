export interface CourseOverallStats {
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