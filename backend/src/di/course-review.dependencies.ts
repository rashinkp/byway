import { CourseReviewController } from "../presentation/http/controllers/course-review.controller";
import { CreateCourseReviewUseCase } from "../app/usecases/course-review/implementations/create-course-review.usecase";
import { UpdateCourseReviewUseCase } from "../app/usecases/course-review/implementations/update-course-review.usecase";
import { DeleteCourseReviewUseCase } from "../app/usecases/course-review/implementations/delete-course-review.usecase";
import { GetCourseReviewsUseCase } from "../app/usecases/course-review/implementations/get-course-reviews.usecase";
import { GetCourseReviewStatsUseCase } from "../app/usecases/course-review/implementations/get-course-review-stats.usecase";
import { GetUserReviewsUseCase } from "../app/usecases/course-review/implementations/get-user-reviews.usecase";
import { DeleteReviewUseCase } from "../app/usecases/course-review/implementations/delete-review.usecase";
import { DisableReviewUseCase } from "../app/usecases/course-review/implementations/disable-review.usecase";
import { SharedDependencies } from "./shared.dependencies";

export interface CourseReviewDependencies {
  courseReviewController: CourseReviewController;
}

export function createCourseReviewDependencies(
  deps: SharedDependencies
): CourseReviewDependencies {
  const {
    courseReviewRepository,
    enrollmentRepository,
  } = deps;

  const createCourseReviewUseCase = new CreateCourseReviewUseCase(
    courseReviewRepository,
    enrollmentRepository
  );

  const updateCourseReviewUseCase = new UpdateCourseReviewUseCase(
    courseReviewRepository
  );

  const deleteCourseReviewUseCase = new DeleteCourseReviewUseCase(
    courseReviewRepository
  );

  const getCourseReviewsUseCase = new GetCourseReviewsUseCase(
    courseReviewRepository
  );

  const getCourseReviewStatsUseCase = new GetCourseReviewStatsUseCase(
    courseReviewRepository
  );

  const getUserReviewsUseCase = new GetUserReviewsUseCase(
    courseReviewRepository
  );

  const deleteReviewUseCase = new DeleteReviewUseCase(
    courseReviewRepository
  );

  const disableReviewUseCase = new DisableReviewUseCase(
    courseReviewRepository
  );

  const courseReviewController = new CourseReviewController(
    createCourseReviewUseCase,
    updateCourseReviewUseCase,
    deleteCourseReviewUseCase,
    getCourseReviewsUseCase,
    getCourseReviewStatsUseCase,
    getUserReviewsUseCase,
    deleteReviewUseCase,
    disableReviewUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    courseReviewController,
  };
} 