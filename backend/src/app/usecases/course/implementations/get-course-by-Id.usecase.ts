import { ICourseWithEnrollmentStatus } from "../../../../domain/dtos/course/course.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { IGetCourseByIdUseCase } from "../interfaces/get-course-by-id.usecase.interface";

export class GetCourseByIdUseCase implements IGetCourseByIdUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private enrollmentRepository: IEnrollmentRepository
  ) {}

  async execute(
    courseId: string,
    userId?: string
  ): Promise<ICourseWithEnrollmentStatus | null> {
    // Get course with all its data
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new HttpError("Course not found", 404);
    }

    // Check enrollment status
    let isEnrolled = false;
    if (userId) {
      const enrollment = await this.enrollmentRepository.findByUserAndCourse(
        userId,
        courseId
      );
      isEnrolled = !!enrollment;
    }

    // Get course data with all its details
    const courseData = course.toJSON();

    return {
      ...courseData,
      isEnrolled,
      instructorSharePercentage: Number(courseData.adminSharePercentage)
    };
  }
}
