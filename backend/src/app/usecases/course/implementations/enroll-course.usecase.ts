import { CourseStatus } from "../../../../domain/enum/course-status.enum";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { IUserRepository } from "../../../repositories/user.repository";
import { IEnrollCourseUseCase } from "../interfaces/enroll-course.usecase.interface";
import { ICreateEnrollmentInput, IEnrollmentWithDetails } from "../../../../domain/types/enrollment.interface";

export class EnrollCourseUseCase implements IEnrollCourseUseCase {
  constructor(
    private _courseRepository: ICourseRepository,
    private _enrollmentRepository: IEnrollmentRepository,
    private _userRepository: IUserRepository
  ) {}

  async execute(
    input: ICreateEnrollmentInput
  ): Promise<IEnrollmentWithDetails[]> {
    const user = await this._userRepository.findById(input.userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    const enrollments: IEnrollmentWithDetails[] = [];
    for (const courseId of input.courseIds) {
      const course = await this._courseRepository.findById(courseId);
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
        await this._enrollmentRepository.findByUserAndCourse(
          input.userId,
          courseId
        );
      if (existingEnrollment) {
        continue; // Skip already enrolled courses
      }

      const newEnrollments = await this._enrollmentRepository.createEnrollments({
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
