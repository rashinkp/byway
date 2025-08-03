import {
  CreateCourseReviewDto,
  CourseReviewResponseDto,
} from "../../../dtos/course-review";
import { CourseReview } from "../../../../domain/entities/course-review.entity";
import { Rating } from "../../../../domain/value-object/rating";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ICreateCourseReviewUseCase } from "../interfaces/create-course-review.usecase.interface";

export class CreateCourseReviewUseCase implements ICreateCourseReviewUseCase {
  constructor(
    private readonly courseReviewRepository: ICourseReviewRepository,
    private readonly enrollmentRepository: IEnrollmentRepository
  ) {}

  async execute(
    input: CreateCourseReviewDto,
    userId: string
  ): Promise<CourseReviewResponseDto> {
    // Check if user is enrolled in the course
    const enrollment = await this.enrollmentRepository.findByUserAndCourse(
      userId,
      input.courseId
    );
    if (!enrollment) {
      throw new Error("You must be enrolled in this course to review it");
    }

    // Check if user already has a review for this course
    const existingReview =
      await this.courseReviewRepository.findByUserAndCourse(
        userId,
        input.courseId
      );
    if (existingReview) {
      throw new Error("User has already reviewed this course");
    }

    // Create rating value object
    const rating = new Rating(input.rating);

    // Create course review entity
    const courseReview = new CourseReview({
      courseId: input.courseId,
      userId: userId,
      rating: rating,
      title: input.title || null,
      comment: input.comment || null,
    });

    // Save to repository
    const savedReview = await this.courseReviewRepository.save(courseReview);

    // Return response DTO
    return {
      id: savedReview.id,
      courseId: savedReview.courseId,
      userId: savedReview.userId,
      rating: savedReview.rating.value,
      title: savedReview.title,
      comment: savedReview.comment,
      createdAt: savedReview.createdAt,
      updatedAt: savedReview.updatedAt,
    };
  }
}
