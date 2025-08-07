import {
  ICreateEnrollmentInputDTO,
  IEnrollmentOutputDTO,
} from "../../../dtos/course.dto";
import { CourseStatus } from "../../../../domain/enum/course-status.enum";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { IUserRepository } from "../../../repositories/user.repository";
import { IEnrollCourseUseCase } from "../interfaces/enroll-course.usecase.interface";

export class EnrollCourseUseCase implements IEnrollCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private enrollmentRepository: IEnrollmentRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(
    input: ICreateEnrollmentInputDTO
  ): Promise<IEnrollmentOutputDTO[]> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    const enrollments: IEnrollmentOutputDTO[] = [];
    for (const courseId of input.courseIds) {
      const course = await this.courseRepository.findById(courseId);
      if (
        !course ||
        course.deletedAt ||
        course.status !== CourseStatus.PUBLISHED
      ) {
        throw new HttpError(
          `Course not found, deleted, or not published: ${courseId}`,
          404
        );
      }

      const existingEnrollment =
        await this.enrollmentRepository.findByUserAndCourse(
          input.userId,
          courseId
        );
      if (existingEnrollment) {
        continue; // Skip already enrolled courses
      }

      const newEnrollments = await this.enrollmentRepository.create({
        userId: input.userId,
        courseIds: [courseId],
        orderItemId: input.orderItemId,
      });

      enrollments.push(...newEnrollments);
    }

    if (enrollments.length === 0) {
      throw new HttpError(
        "No new enrollments created (all courses already enrolled)",
        400
      );
    }

    return enrollments;
  }
}
