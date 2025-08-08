import {
  IGetAllCoursesInputDTO,
  IGetEnrolledCoursesInputDTO,
  ICourseListResponseDTO,
} from "../dtos/course.dto";
import { Course } from "../../domain/entities/course.entity";
import { CourseDetails } from "../../domain/entities/course.entity";
import {
  ICourseStats,
  IGetCourseStatsInput,
} from "../usecases/course/interfaces/get-course-stats.usecase.interface";
import { IGetTopEnrolledCoursesInput } from "../usecases/course/interfaces/top-enrolled-courses.usecase.interface";
import { CourseStats } from "../dtos/stats.dto";

export interface ICourseRepository {
  save(course: Course): Promise<Course>;
  findById(id: string): Promise<Course | null>;
  findByName(title: string): Promise<Course | null>;
  findAll(input: IGetAllCoursesInputDTO): Promise<ICourseListResponseDTO>;
  update(course: Course): Promise<Course>;
  softDelete(course: Course): Promise<Course>;
  findEnrolledCourses(
    input: IGetEnrolledCoursesInputDTO
  ): Promise<ICourseListResponseDTO>;
  updateApprovalStatus(course: Course): Promise<Course>;
  findCourseDetails(courseId: string): Promise<CourseDetails | null>;
  updateCourseDetails(
    courseId: string,
    details: CourseDetails
  ): Promise<CourseDetails>;

  // Course stats methods
  getCourseStats(input: IGetCourseStatsInput): Promise<ICourseStats>;
  getTopEnrolledCourses(
    input: IGetTopEnrolledCoursesInput
  ): Promise<CourseStats[]>;
}
