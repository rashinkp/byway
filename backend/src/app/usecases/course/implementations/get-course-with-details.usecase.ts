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

    // Properly map domain entity to DTO
    const courseData: ICourseWithEnrollmentDTO = {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      price: course.price?.getValue() ?? null,
      thumbnail: course.thumbnail,
      duration: course.duration?.getValue() ?? null,
      offer: course.offer?.getValue() ?? null,
      status: course.status,
      categoryId: course.categoryId,
      createdBy: course.createdBy,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
      deletedAt: course.deletedAt?.toISOString() ?? null,
      approvalStatus: course.approvalStatus,
      adminSharePercentage: course.adminSharePercentage,
      instructorSharePercentage: 100 - course.adminSharePercentage,
      details: courseDetails?.toJSON() ?? null,
      rating: course.rating,
      reviewCount: course.reviewCount,
      lessons: course.lessons,
      bestSeller: course.bestSeller,
      isEnrolled,
      isInCart,
      instructor: {
        id: course.createdBy,
        name: "Unknown Instructor", 
        avatar: null,
      },
      reviewStats: {
        averageRating: reviewStats.averageRating,
        totalReviews: reviewStats.totalReviews,
      },
    };

    return courseData;
  }
}
