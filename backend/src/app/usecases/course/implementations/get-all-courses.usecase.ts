import {
  ICourseListResponseDTO,
  IGetAllCoursesInputDTO,
} from "../../../dtos/course.dto";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ICartRepository } from "../../../repositories/cart.repository";
import { IUserRepository } from "../../../repositories/user.repository";
import { ICourseReviewRepository } from "../../../repositories/course-review.repository.interface";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IGetAllCoursesUseCase } from "../interfaces/get-all-courses.usecase.interface";
import { ValidationError } from "../../../../domain/errors/domain-errors";

export class GetAllCoursesUseCase implements IGetAllCoursesUseCase {
  constructor(
    private _courseRepository: ICourseRepository,
    private _enrollmentRepository: IEnrollmentRepository,
    private _cartRepository: ICartRepository,
    private _userRepository: IUserRepository,
    private _courseReviewRepository: ICourseReviewRepository,
    private _lessonRepository: ILessonRepository
  ) {}

  async execute(
    input: IGetAllCoursesInputDTO
  ): Promise<ICourseListResponseDTO> {
    try {
      const result = await this._courseRepository.findAll(input);

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
          // Check enrollment status
          let isEnrolled = false;
          if (input.userId) {
            const enrollment =
              await this._enrollmentRepository.findByUserAndCourse(
                input.userId,
                course.id
              );
            isEnrolled = !!enrollment;
          }
          // Check cart status
          let isInCart = false;
          if (input.userId) {
            const cartItem = await this._cartRepository.findByUserAndCourse(
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
    } catch {
      throw new ValidationError("Failed to retrieve courses");
    }
  }
}
