import { ILessonContentOutputDTO } from "../../../dtos/lesson.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonContentRepository } from "../../../repositories/content.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IGetContentByLessonIdUseCase } from "../interfaces/get-content-by-lesson-id.usecase.interface";
import { ICourseRepository } from "../../../repositories/course.repository.interface";

export class GetContentByLessonIdUseCase
  implements IGetContentByLessonIdUseCase
{
  constructor(
    private readonly _contentRepository: ILessonContentRepository,
    private readonly _lessonRepository: ILessonRepository,
    private readonly _enrollmentRepository: IEnrollmentRepository,
    private readonly _courseRepository: ICourseRepository
  ) {}

  async execute(
    lessonId: string,
    user: { id: string; role: string }
  ): Promise<ILessonContentOutputDTO | null> {
    try {
      // Get lesson to find courseId
      const lesson = await this._lessonRepository.findById(lessonId);
      if (!lesson) {
        throw new HttpError("Lesson not found", 404);
      }

      // Get course to check if user is instructor or admin
      const course = await this._courseRepository.findById(lesson.courseId);
      if (!course) {
        throw new HttpError("Course not found", 404);
      }

      // If user is admin, allow access
      if (user.role === "ADMIN") {
        const content = await this._contentRepository.findByLessonId(lessonId);
        return content && content.isActive() ? content.toJSON() as unknown as ILessonContentOutputDTO : null;
      }

      // If user is the course instructor, allow access without enrollment check
      if (course.createdBy === user.id) {
        const content = await this._contentRepository.findByLessonId(lessonId);
        return content && content.isActive() ? content.toJSON() as unknown as ILessonContentOutputDTO : null;
      }

      // For non-instructors, check enrollment
      const enrollment = await this._enrollmentRepository.findByUserAndCourse(
        user.id,
        lesson.courseId
      );
      if (!enrollment) {
        throw new HttpError("You are not enrolled in this course", 403);
      }

      if (enrollment.accessStatus !== "ACTIVE") {
        throw new HttpError("Your enrollment is not active", 403);
      }

      const content = await this._contentRepository.findByLessonId(lessonId);
      return content && content.isActive() ? content.toJSON() as unknown as ILessonContentOutputDTO : null;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to fetch content", 500);
    }
  }
}
