import { ICourseWithEnrollmentStatus } from "../../../../domain/dtos/course/course.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { IGetCourseByIdUseCase } from "../interfaces/get-course-by-id.usecase.interface";
import { APPROVALSTATUS } from "../../../../domain/enum/approval-status.enum";
import { CourseStatus } from "../../../../domain/enum/course-status.enum";
import { JwtPayload } from "jsonwebtoken";

export class GetCourseByIdUseCase implements IGetCourseByIdUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private enrollmentRepository: IEnrollmentRepository
  ) {}

  async execute(
    courseId: string,
    user?: JwtPayload
  ): Promise<ICourseWithEnrollmentStatus | null> {
    // Get course with all its data
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new HttpError("Course not found", 404);
    }

    const courseData = course.toJSON();
    
    // Check if user has permission to view the course
    const isAdmin = user?.role === "ADMIN";
    const isCreator = user?.id === courseData.createdBy;

    // If not admin or creator, check course status
    if (!isAdmin && !isCreator) {
      if (
        courseData.deletedAt ||
        courseData.approvalStatus !== APPROVALSTATUS.APPROVED ||
        courseData.status !== CourseStatus.PUBLISHED
      ) {
        throw new HttpError("Course not found", 404);
      }
    }

    // Check enrollment status
    let isEnrolled = false;
    if (user?.id) {
      const enrollment = await this.enrollmentRepository.findByUserAndCourse(
        user.id,
        courseId
      );
      isEnrolled = !!enrollment;
    }

    return {
      ...courseData,
      isEnrolled,
      instructorSharePercentage: Number(courseData.adminSharePercentage)
    };
  }
}
