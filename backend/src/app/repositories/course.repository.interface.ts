import { Course } from "../../domain/entities/course.entity";
import { CourseDetails } from "../../domain/entities/course.entity";
import { IGetTopEnrolledCoursesInput } from "../usecases/course/interfaces/top-enrolled-courses.usecase.interface";
import {
  CourseOverallStats,
  CourseStats,
} from "../../domain/types/course-stats.interface";
import {
  CourseStatsInput,
  CourseWithEnrollment,
} from "../../domain/types/course.interface";
import {
  FilterCourse,
  PaginatedResult,
} from "../../domain/types/pagination-filter.interface";
import { IGenericRepository } from "./generic-repository.interface";

export interface ICourseRepository extends IGenericRepository<Course> {
  save(course: Course): Promise<Course>;
  findByName(title: string): Promise<Course | null>;
  findAll(input: FilterCourse): Promise<PaginatedResult<CourseWithEnrollment>>;
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
    input: IGetTopEnrolledCoursesInput
  ): Promise<CourseStats[]>;
}
