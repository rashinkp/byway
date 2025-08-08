import {
  ICourseListResponseDTO,
  IGetEnrolledCoursesInputDTO,
} from "../../../dtos/course.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IUserRepository } from "../../../repositories/user.repository";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IGetEnrolledCoursesUseCase } from "../interfaces/get-enrolled-courses.usecase.interface";

export class GetEnrolledCoursesUseCase implements IGetEnrolledCoursesUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository,
    private courseReviewRepository: ICourseReviewRepository,
    private lessonRepository: ILessonRepository
  ) {}

  async execute(
    input: IGetEnrolledCoursesInputDTO
  ): Promise<ICourseListResponseDTO> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    try {
      const result = await this.courseRepository.findEnrolledCourses(input);

      // Enhance courses with additional data
      const enhancedCourses = await Promise.all(
        result.courses.map(async (course) => {
          // Get instructor details
          const instructor = await this.userRepository.findById(
            course.createdBy
          );

          // Get review stats
          const reviewStats =
            await this.courseReviewRepository.getCourseReviewStats(course.id);

          // Get lesson count
          const lessons = await this.lessonRepository.findByCourseId(course.id);
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
      throw new HttpError("Failed to retrieve enrolled courses", 500);
    }
  }
}
