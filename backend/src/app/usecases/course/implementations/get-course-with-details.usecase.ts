import { ICourseWithEnrollmentDTO } from "../../../../domain/dtos/course/course.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { ICartRepository } from "../../../repositories/cart.repository";
import { APPROVALSTATUS } from "../../../../domain/enum/approval-status.enum";
import { CourseStatus } from "../../../../domain/enum/course-status.enum";
import { JwtPayload } from "jsonwebtoken";
import { IGetCourseWithDetailsUseCase } from "../interfaces/get-course-with-details.usecase.interface";

export class GetCourseWithDetailsUseCase
  implements IGetCourseWithDetailsUseCase
{
  constructor(
    private courseRepository: ICourseRepository,
    private enrollmentRepository: IEnrollmentRepository,
    private courseReviewRepository: ICourseReviewRepository,
    private cartRepository: ICartRepository
  ) {}

  async execute(
    courseId: string,
    user?: JwtPayload
  ): Promise<ICourseWithEnrollmentDTO | null> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new HttpError("Course not found", 404);
    }

    const isAdmin = user?.role === "ADMIN";
    const isCreator = user?.id === course.createdBy;

    if (!isAdmin && !isCreator) {
      if (
        course.deletedAt ||
        course.approvalStatus !== APPROVALSTATUS.APPROVED ||
        course.status !== CourseStatus.PUBLISHED
      ) {
        throw new HttpError("Course not found", 404);
      }
    }

    const courseDetails = await this.courseRepository.findCourseDetails(
      course.id
    );
    let isEnrolled = false;
    if (user?.id) {
      const enrollment = await this.enrollmentRepository.findByUserAndCourse(
        user.id,
        courseId
      );
      isEnrolled = !!enrollment;
    }

    // Check cart status
    let isInCart = false;
    if (user?.id) {
      const cartItem = await this.cartRepository.findByUserAndCourse(
        user.id,
        courseId
      );
      isInCart = !!cartItem;
    }

    // Get review stats
    const reviewStats = await this.courseReviewRepository.getCourseReviewStats(
      courseId
    );

    const courseData = course.toJSON();
    return {
      ...courseData,
      isEnrolled,
      isInCart,
      details: courseDetails?.toJSON() ?? null,
      instructorSharePercentage: 100 - courseData.adminSharePercentage,
      reviewStats: {
        averageRating: reviewStats.averageRating,
        totalReviews: reviewStats.totalReviews,
        ratingDistribution: reviewStats.ratingDistribution,
        ratingPercentages: Object.fromEntries(
          Object.entries(reviewStats.ratingDistribution).map(
            ([rating, count]) => [
              rating,
              reviewStats.totalReviews > 0
                ? (count / reviewStats.totalReviews) * 100
                : 0,
            ]
          )
        ),
      },
    };
  }
}
