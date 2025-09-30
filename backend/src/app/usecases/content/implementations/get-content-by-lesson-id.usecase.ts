import {
  ILessonContentOutputDTO
} from "../../../dtos/lesson.dto";
import { ILessonContentRepository } from "../../../repositories/content.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IGetContentByLessonIdUseCase } from "../interfaces/get-content-by-lesson-id.usecase.interface";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { CourseNotFoundError, LessonNotFoundError, UserAuthorizationError } from "../../../../domain/errors/domain-errors";
import { LessonContent } from "../../../../domain/entities/content.entity";

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
        throw new LessonNotFoundError(lessonId);
      }

      // Get course to check if user is instructor or admin
      const course = await this._courseRepository.findById(lesson.courseId);
      if (!course) {
        throw new CourseNotFoundError(lesson.courseId);
      }

      // If user is admin, allow access
      if (user.role === "ADMIN") {
        const content = await this._contentRepository.findByLessonId(lessonId);
        return content && content.isActive() ? this._mapToDTO(content) : null;
      }

      // If user is the course instructor, allow access without enrollment check
      if (course.createdBy === user.id) {
        const content = await this._contentRepository.findByLessonId(lessonId);
        return content && content.isActive() ? this._mapToDTO(content) : null;
      }

      // For non-instructors, check enrollment
      const enrollment = await this._enrollmentRepository.findByUserAndCourse(
        user.id,
        lesson.courseId
      );
      if (!enrollment) {
        throw new UserAuthorizationError("You are not enrolled in this course");
      }

      if (enrollment.accessStatus !== "ACTIVE") {
        throw new UserAuthorizationError("Your enrollment is not active");
      }

      const content = await this._contentRepository.findByLessonId(lessonId);
      return content && content.isActive() ? this._mapToDTO(content) : null;
    } catch (error) {
      if (error instanceof LessonNotFoundError || error instanceof CourseNotFoundError || error instanceof UserAuthorizationError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new UserAuthorizationError(error.message);
      }
      throw new UserAuthorizationError("Failed to fetch content");
    }
  }

  private _mapToDTO(content: LessonContent): ILessonContentOutputDTO {
    return {
      id: content.id,
      lessonId: content.lessonId,
      type: content.type,
      status: content.status,
      title: content.title,
      description: content.description,
      fileUrl: content.fileUrl,
      thumbnailUrl: content.thumbnailUrl,
      quizQuestions: content.quizQuestions,
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
      deletedAt: content.deletedAt?.toISOString() ?? null,
    };
  }
}
