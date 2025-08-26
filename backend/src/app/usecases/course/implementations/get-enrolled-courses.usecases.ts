import {
  ICourseListResponseDTO,
  IGetEnrolledCoursesInputDTO,
} from "../../../dtos/course.dto";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IUserRepository } from "../../../repositories/user.repository";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IGetEnrolledCoursesUseCase } from "../interfaces/get-enrolled-courses.usecase.interface";
import { UserNotFoundError, ValidationError } from "../../../../domain/errors/domain-errors";

export class GetEnrolledCoursesUseCase implements IGetEnrolledCoursesUseCase {
  constructor(
    private _courseRepository: ICourseRepository,
    private _userRepository: IUserRepository,
    private _courseReviewRepository: ICourseReviewRepository,
    private _lessonRepository: ILessonRepository
  ) {}

  async execute(
    input: IGetEnrolledCoursesInputDTO
  ): Promise<ICourseListResponseDTO> {
    const user = await this._userRepository.findById(input.userId);
    if (!user) {
      throw new UserNotFoundError(input.userId);
    }

    try {
      const result = await this._courseRepository.findEnrolledCourses(input);

      // Enhance courses with additional data
      const enhancedCourses = await Promise.all(
        result.items.map(async (course) => {
          // Get instructor details
          const instructor = await this._userRepository.findById(
            course.createdBy
          );

          // Get review stats
          const reviewStats =
            await this._courseReviewRepository.getCourseReviewStats(course.id);

          // Get lesson count
          const lessons = await this._lessonRepository.findByCourseId(course.id);
          const lessonCount = lessons.length;

          return {
            ...course,
            instructor: instructor
              ? {
                  id: instructor.id,
                  name: instructor.name,
                  avatar: instructor.avatar || null,
                }
              : {
                  id: course.createdBy,
                  name: "Unknown Instructor",
                  avatar: null,
                },
            reviewStats: {
              averageRating: reviewStats.averageRating,
              totalReviews: reviewStats.totalReviews,
            },
            lessons: lessonCount,
            isEnrolled: true, // These are enrolled courses
            isInCart: false, // Enrolled courses are not in cart
          };
        })
      );

      return {
        ...result,
        courses: enhancedCourses,
      };
    } catch {
      throw new ValidationError("Failed to retrieve enrolled courses");
    }
  }
}
