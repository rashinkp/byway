import {
  ICourseListResponseDTO,
  IGetAllCoursesInputDTO,
} from "../../../dtos/course.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ICartRepository } from "../../../repositories/cart.repository";
import { IUserRepository } from "../../../repositories/user.repository";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IGetAllCoursesUseCase } from "../interfaces/get-all-courses.usecase.interface";

export class GetAllCoursesUseCase implements IGetAllCoursesUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private enrollmentRepository: IEnrollmentRepository,
    private cartRepository: ICartRepository,
    private userRepository: IUserRepository,
    private courseReviewRepository: ICourseReviewRepository,
    private lessonRepository: ILessonRepository
  ) {}

  async execute(
    input: IGetAllCoursesInputDTO
  ): Promise<ICourseListResponseDTO> {
    try {
      const result = await this.courseRepository.findAll(input);

      // Enhance courses with additional data
      const enhancedCourses = await Promise.all(
        result.items.map(async (course) => {
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
          // Check enrollment status
          let isEnrolled = false;
          if (input.userId) {
            const enrollment =
              await this.enrollmentRepository.findByUserAndCourse(
                input.userId,
                course.id
              );
            isEnrolled = !!enrollment;
          }
          // Check cart status
          let isInCart = false;
          if (input.userId) {
            const cartItem = await this.cartRepository.findByUserAndCourse(
              input.userId,
              course.id
            );
            isInCart = !!cartItem;
          }
          const enhancedCourse = {
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
            isEnrolled,
            isInCart,
          };
          return enhancedCourse;
        })
      );

      return {
        ...result,
        courses: enhancedCourses,
      };
    } catch (error) {
      console.error("GetAllCoursesUseCase error:", error);
      throw new HttpError("Failed to retrieve courses", 500);
    }
  }
}
