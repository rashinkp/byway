import { Course } from "../../domain/entities/course.entity";
import { CourseDetails } from "../../domain/entities/course.entity";
import { CourseOverallStats, CourseStats } from "../../domain/types/course-stats.interface";
import { CourseStatsInput, CourseWithEnrollment } from "../../domain/types/course.interface";
import { FilterCourse, PaginatedResult } from "../../domain/types/pagination-filter.interface";

export interface ICourseRepository {
  save(course: Course): Promise<Course>;
  findById(id: string): Promise<Course | null>;
  findByName(title: string): Promise<Course | null>;
  findAll(input: FilterCourse): Promise<PaginatedResult<CourseWithEnrollment>>;
  update(course: Course): Promise<Course>;
  softDelete(course: Course): Promise<Course>;
  findEnrolledCourses(
    input: FilterCourse
  ): Promise<PaginatedResult<CourseWithEnrollment>>;
  updateApprovalStatus(course: Course): Promise<Course>;
  findCourseDetails(courseId: string): Promise<CourseDetails | null>;
  updateCourseDetails(
    courseId: string,
    details: CourseDetails
  ): Promise<CourseDetails>;

  // Course stats methods
  getCourseStats(input: CourseStatsInput): Promise<CourseOverallStats>;
  getTopEnrolledCourses(
    input: {
      limit?: number;
      period?: string;
      userId?: string;
    }
  ): Promise<CourseStats[]>;
}
