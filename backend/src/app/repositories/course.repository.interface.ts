import {
  ICourseResponseDTO,
  IGetAllCoursesInputDTO,
  IGetEnrolledCoursesInputDTO,
} from "../../domain/dtos/course/course.dto";
import { Course } from "../../domain/entities/course.entity";
import { CourseDetails } from "../../domain/entities/course.entity";

export interface ICourseRepository {
  save(course: Course): Promise<Course>;
  findById(id: string): Promise<Course | null>;
  findByName(title: string): Promise<Course | null>;
  findAll(input: IGetAllCoursesInputDTO): Promise<ICourseResponseDTO>;
  update(course: Course): Promise<Course>;
  softDelete(course: Course): Promise<Course>;
  findEnrolledCourses(
    input: IGetEnrolledCoursesInputDTO
  ): Promise<ICourseResponseDTO>;
  updateApprovalStatus(course: Course): Promise<Course>;
  findCourseDetails(courseId: string): Promise<CourseDetails | null>;
  updateCourseDetails(courseId: string, details: CourseDetails): Promise<CourseDetails>;
}
