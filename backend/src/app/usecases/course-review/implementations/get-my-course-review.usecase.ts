import { CourseReviewResponseDto } from "../../../dtos/course-review";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { IGetMyCourseReviewUseCase } from "../interfaces/get-my-course-review.usecase.interface";

export class GetMyCourseReviewUseCase implements IGetMyCourseReviewUseCase {
  constructor(
    private readonly courseReviewRepository: ICourseReviewRepository
  ) {}

  async execute(
    courseId: string,
    userId: string
  ): Promise<CourseReviewResponseDto | null> {
    const review = await this.courseReviewRepository.findByUserAndCourse(
      userId,
      courseId
    );

    if (!review) {
      return null;
    }

    return {
      id: review.id,
      courseId: review.courseId,
      userId: review.userId,
      rating: review.rating.value,
      title: review.title,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}
