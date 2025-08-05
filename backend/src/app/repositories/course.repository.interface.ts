import { CourseRecord } from "../records/course.record";
import { CourseDetailsRecord } from "../records/course-details.record";

export interface ICourseRepository {
  save(course: CourseRecord): Promise<CourseRecord>;
  findById(id: string): Promise<CourseRecord | null>;
  findByName(title: string): Promise<CourseRecord | null>;
  findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    includeDeleted?: boolean;
    search?: string;
    filterBy?: string;
    userId?: string;
    myCourses?: boolean;
    role?: string;
    level?: string;
    duration?: string;
    price?: string;
    categoryId?: string;
  }): Promise<{ courses: CourseRecord[]; total: number; totalPages: number }>;
  update(course: CourseRecord): Promise<CourseRecord>;
  softDelete(course: CourseRecord): Promise<CourseRecord>;
  findEnrolledCourses(options: {
    userId: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
    level?: string;
  }): Promise<{ courses: CourseRecord[]; total: number; totalPages: number }>;
  updateApprovalStatus(course: CourseRecord): Promise<CourseRecord>;
  findCourseDetails(courseId: string): Promise<CourseDetailsRecord | null>;
  updateCourseDetails(courseId: string, details: CourseDetailsRecord): Promise<CourseDetailsRecord>;

  // Course stats methods
  getCourseStats(options: { userId?: string }): Promise<{
    totalCourses: number;
    publishedCourses: number;
    draftCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
  }>;
  getTopEnrolledCourses(options: { limit?: number }): Promise<{
    courseId: string;
    title: string;
    enrollments: number;
    revenue: number;
  }[]>;
}
