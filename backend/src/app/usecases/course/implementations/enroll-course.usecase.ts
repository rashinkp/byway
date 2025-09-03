import { CourseStatus } from "../../../../domain/enum/course-status.enum";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { IUserRepository } from "../../../repositories/user.repository";
import { IEnrollCourseUseCase } from "../interfaces/enroll-course.usecase.interface";
import { ICreateEnrollmentInput, IEnrollmentWithDetails } from "../../../../domain/types/enrollment.interface";
import { UserNotFoundError, CourseNotFoundError, BusinessRuleViolationError } from "../../../../domain/errors/domain-errors";

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
      throw new UserNotFoundError(input.userId);
    }

    const enrollments: IEnrollmentWithDetails[] = [];
    for (const courseId of input.courseIds) {
      const course = await this._courseRepository.findById(courseId);
      if (
        !course ||
        course.deletedAt ||
        course.status !== CourseStatus.PUBLISHED
      ) {
        throw new CourseNotFoundError(courseId);
      }

      const existingEnrollment =
        await this._enrollmentRepository.findByUserAndCourse(
          input.userId,
          courseId
        );
      if (existingEnrollment) {
        continue; // Skip already enrolled courses
      }

      const newEnrollments = await this._enrollmentRepository.create({
        userId: input.userId,
        courseIds: [courseId],
        orderItemId: input.orderItemId,
      });

      enrollments.push(...newEnrollments);
    }

    if (enrollments.length === 0) {
      throw new BusinessRuleViolationError(
        "No new enrollments created (all courses already enrolled)"
      );
    }

    return enrollments;
  }
}
