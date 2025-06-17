import { CourseReviewResponseDto } from "../../../../domain/dtos/course-review";

export interface IGetMyCourseReviewUseCase {
  execute(courseId: string, userId: string): Promise<CourseReviewResponseDto | null>;
} 