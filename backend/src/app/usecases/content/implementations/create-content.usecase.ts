import {
  ICreateLessonContentInputDTO,
  ILessonContentOutputDTO,
} from "../../../dtos/lesson.dto";
import { LessonContent } from "../../../../domain/entities/content.entity";
import { ILessonContentRepository } from "../../../repositories/content.repository";
import { ICreateLessonContentUseCase } from "../interfaces/create-content.usecase.interface";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { CourseNotFoundError, LessonNotFoundError, UserAuthorizationError, ContentValidationError } from "../../../../domain/errors/domain-errors";

export class CreateLessonContentUseCase implements ICreateLessonContentUseCase {
  constructor(
    private readonly _contentRepository: ILessonContentRepository,
    private readonly _lessonRepository: ILessonRepository,
    private readonly _courseRepository: ICourseRepository
  ) {}

  async execute(
    dto: ICreateLessonContentInputDTO & { userId: string }
  ): Promise<ILessonContentOutputDTO> {
    try {
      // Get the lesson to find the course ID
      const lesson = await this._lessonRepository.findById(dto.lessonId);
      if (!lesson) {
        throw new LessonNotFoundError(dto.lessonId);
      }

      // Get the course to verify instructor
      const course = await this._courseRepository.findById(lesson.courseId);
      if (!course) {
        throw new CourseNotFoundError(lesson.courseId);
      }

      // Verify the user is the instructor of the course
      if (course.createdBy !== dto.userId) {
        throw new UserAuthorizationError(
          "You are not authorized to create content for this lesson"
        );
      }

      const content = LessonContent.create(dto);
      const createdContent = await this._contentRepository.create(content);
      return createdContent.toJSON() as unknown as ILessonContentOutputDTO;
    } catch (error) {
      if (
        error instanceof LessonNotFoundError ||
        error instanceof CourseNotFoundError ||
        error instanceof UserAuthorizationError
      ) {
        throw error;
      }
      if (error instanceof Error) {
        throw new ContentValidationError(error.message);
      }
      throw new ContentValidationError("Failed to create content");
    }
  }
}
