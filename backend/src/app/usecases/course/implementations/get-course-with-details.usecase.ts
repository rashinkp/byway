import { ICourseWithEnrollmentDTO } from "../../../dtos/course.dto";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { ICartRepository } from "../../../repositories/cart.repository";
import { APPROVALSTATUS } from "../../../../domain/enum/approval-status.enum";
import { CourseStatus } from "../../../../domain/enum/course-status.enum";
import { IGetCourseWithDetailsUseCase } from "../interfaces/get-course-with-details.usecase.interface";
import { UserDTO } from "../../../dtos/general.dto";
import { CourseNotFoundError } from "../../../../domain/errors/domain-errors";

export class GetCourseWithDetailsUseCase
  implements IGetCourseWithDetailsUseCase
{
  constructor(
    private _courseRepository: ICourseRepository,
    private _enrollmentRepository: IEnrollmentRepository,
    private _courseReviewRepository: ICourseReviewRepository,
    private _cartRepository: ICartRepository
  ) { }

  async execute(
    courseId: string,
    user?: UserDTO
  ): Promise<ICourseWithEnrollmentDTO | null> {
    const course = await this._courseRepository.findById(courseId);
    if (!course) {
      throw new CourseNotFoundError(courseId);
    }

    const isAdmin = user?.role === "ADMIN";
    const isCreator = user?.id === course.createdBy;

    if (!isAdmin && !isCreator) {
      if (
        course.deletedAt ||
        course.approvalStatus !== APPROVALSTATUS.APPROVED ||
        course.status !== CourseStatus.PUBLISHED
      ) {
        throw new CourseNotFoundError(courseId);
      }
    }

    const courseDetails = await this._courseRepository.findCourseDetails(
      course.id
    );
    let isEnrolled = false;
    if (user?.id) {
      const enrollment = await this._enrollmentRepository.findByUserAndCourse(
        user.id,
        courseId
      );
      isEnrolled = !!enrollment;
    }

    // Check cart status
    let isInCart = false;
    if (user?.id) {
      const cartItem = await this._cartRepository.findByUserAndCourse(
        user.id,
        courseId
      );
      isInCart = !!cartItem;
    }

    // Get review stats
    const reviewStats = await this._courseReviewRepository.getCourseReviewStats(
      courseId
    );

    const courseData = course.toJSON();
    return {
      ...courseData,
      isEnrolled,
      isInCart,
      details: courseDetails?.toJSON() ?? null,
      instructorSharePercentage: 100 - (courseData.adminSharePercentage as number),
      reviewStats: {
        averageRating: reviewStats.averageRating,
        totalReviews: reviewStats.totalReviews,
      },
    } as ICourseWithEnrollmentDTO;
  }
}
