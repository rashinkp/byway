import {
  ICreateLessonInputDTO,
  ILessonOutputDTO,
} from "../../../dtos/lesson.dto";
import { Lesson } from "../../../../domain/entities/lesson.entity";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { ICreateLessonUseCase } from "../interfaces/create-lesson.usecase.interface";
import { LessonValidationError } from "../../../../domain/errors/domain-errors";

export class CreateLessonUseCase implements ICreateLessonUseCase {
  constructor(private readonly _lessonRepository: ILessonRepository) {}

  async execute(dto: ICreateLessonInputDTO): Promise<ILessonOutputDTO> {
    try {
      const existingLesson = await this._lessonRepository.findByCourseIdAndOrder(
        dto.courseId,
        dto.order
      );
      if (existingLesson) {
        throw new LessonValidationError(
          `A lesson with order ${dto.order} already exists for course ${dto.title}`
        );
      }

      const lesson = Lesson.create(dto);
      const createdLesson = await this._lessonRepository.create(lesson);
      // Map domain entity to DTO
      return {
        id: createdLesson.id,
        title: createdLesson.title,
        description: createdLesson.description,
        order: createdLesson.order,
        courseId: createdLesson.courseId,
        status: createdLesson.status,
        content: createdLesson.content ? {
          id: createdLesson.content.id,
          lessonId: createdLesson.content.lessonId,
          type: createdLesson.content.type,
          status: createdLesson.content.status,
          title: createdLesson.content.title,
          description: createdLesson.content.description,
          fileUrl: createdLesson.content.fileUrl,
          thumbnailUrl: createdLesson.content.thumbnailUrl,
          quizQuestions: createdLesson.content.quizQuestions,
          createdAt: createdLesson.content.createdAt.toISOString(),
          updatedAt: createdLesson.content.updatedAt.toISOString(),
          deletedAt: createdLesson.content.deletedAt?.toISOString() ?? null,
        } : null,
        thumbnail: null, // Not available in domain entity
        duration: null, // Not available in domain entity
        createdAt: createdLesson.createdAt.toISOString(),
        updatedAt: createdLesson.updatedAt.toISOString(),
        deletedAt: createdLesson.deletedAt?.toISOString() ?? null,
      };
    } catch (error) {
      if (error instanceof LessonValidationError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new LessonValidationError(error.message);
      }
      throw new LessonValidationError("Failed to create lesson");
    }
  }
}
