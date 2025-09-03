import {
  ILessonOutputDTO,
  IUpdateLessonInputDTO,
} from "../../../dtos/lesson.dto";
import { Lesson } from "../../../../domain/entities/lesson.entity";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IUpdateLessonUseCase } from "../interfaces/update-lesson.usecase.interface";
import { ILessonContentRepository } from "../../../repositories/content.repository";
import { LessonStatus } from "../../../../domain/enum/lesson.enum";
import { LessonNotFoundError, LessonValidationError } from "../../../../domain/errors/domain-errors";

export class UpdateLessonUseCase implements IUpdateLessonUseCase {
  constructor(
    private readonly _lessonRepository: ILessonRepository,
    private readonly _contentRepository: ILessonContentRepository
  ) {}

  async execute(dto: IUpdateLessonInputDTO): Promise<ILessonOutputDTO> {
    try {
      const lesson = await this._lessonRepository.findById(dto.lessonId);
      if (!lesson || !lesson.isActive()) {
        throw new LessonNotFoundError(dto.lessonId);
      }

      // Check if content exists when publishing
      if (dto.status === LessonStatus.PUBLISHED) {
        const content = await this._contentRepository.findByLessonId(
          dto.lessonId
        );
        if (!content) {
          throw new LessonValidationError("Cannot publish lesson without content");
        }
      }

      const updatedLesson = Lesson.update(lesson, dto);
      const savedLesson = await this._lessonRepository.update(updatedLesson);
      // Map domain entity to DTO
      return {
        id: savedLesson.id,
        title: savedLesson.title,
        description: savedLesson.description,
        order: savedLesson.order,
        courseId: savedLesson.courseId,
        status: savedLesson.status,
        content: savedLesson.content ? {
          id: savedLesson.content.id,
          lessonId: savedLesson.content.lessonId,
          type: savedLesson.content.type,
          status: savedLesson.content.status,
          title: savedLesson.content.title,
          description: savedLesson.content.description,
          fileUrl: savedLesson.content.fileUrl,
          thumbnailUrl: savedLesson.content.thumbnailUrl,
          quizQuestions: savedLesson.content.quizQuestions,
          createdAt: savedLesson.content.createdAt.toISOString(),
          updatedAt: savedLesson.content.updatedAt.toISOString(),
          deletedAt: savedLesson.content.deletedAt?.toISOString() ?? null,
        } : null,
        thumbnail: null, // Not available in domain entity
        duration: null, // Not available in domain entity
        createdAt: savedLesson.createdAt.toISOString(),
        updatedAt: savedLesson.updatedAt.toISOString(),
        deletedAt: savedLesson.deletedAt?.toISOString() ?? null,
      };
    } catch (error) {
      if (error instanceof LessonNotFoundError || error instanceof LessonValidationError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new LessonValidationError(error.message);
      }
      throw new LessonValidationError("Failed to update lesson");
    }
  }
}
