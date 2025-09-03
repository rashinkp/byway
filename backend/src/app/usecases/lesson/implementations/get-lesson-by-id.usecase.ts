import { ILessonOutputDTO } from "../../../dtos/lesson.dto";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IGetLessonByIdUseCase } from "../interfaces/get-lesson-by-id.usecase.interface";
import { LessonNotFoundError } from "../../../../domain/errors/domain-errors";

export class GetLessonByIdUseCase implements IGetLessonByIdUseCase {
  constructor(private readonly _lessonRepository: ILessonRepository) {}

  async execute(id: string): Promise<ILessonOutputDTO> {
    try {
      const lesson = await this._lessonRepository.findById(id);
      if (!lesson || !lesson.isActive()) {
        throw new LessonNotFoundError(id);
      }
      // Map domain entity to DTO
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        courseId: lesson.courseId,
        status: lesson.status,
        content: lesson.content ? {
          id: lesson.content.id,
          lessonId: lesson.content.lessonId,
          type: lesson.content.type,
          status: lesson.content.status,
          title: lesson.content.title,
          description: lesson.content.description,
          fileUrl: lesson.content.fileUrl,
          thumbnailUrl: lesson.content.thumbnailUrl,
          quizQuestions: lesson.content.quizQuestions,
          createdAt: lesson.content.createdAt.toISOString(),
          updatedAt: lesson.content.updatedAt.toISOString(),
          deletedAt: lesson.content.deletedAt?.toISOString() ?? null,
        } : null,
        thumbnail: null, // Not available in domain entity
        duration: null, // Not available in domain entity
        createdAt: lesson.createdAt.toISOString(),
        updatedAt: lesson.updatedAt.toISOString(),
        deletedAt: lesson.deletedAt?.toISOString() ?? null,
      };
    } catch (error) {
      if (error instanceof LessonNotFoundError) {
        throw error;
      }
      throw new LessonNotFoundError("Failed to fetch lesson");
    }
  }
}
