import {
  IGetAllLessonsInputDTO,
  ILessonListOutputDTO,
} from "../../../dtos/lesson.dto";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IGetAllLessonsUseCase } from "../interfaces/get-all-lessons.usecase.interface";
import { ValidationError } from "../../../../domain/errors/domain-errors";

export class GetAllLessonsUseCase implements IGetAllLessonsUseCase {
  constructor(private readonly _lessonRepository: ILessonRepository) {}

  async execute(params: IGetAllLessonsInputDTO): Promise<ILessonListOutputDTO> {
    try {
      const result = await this._lessonRepository.getAllLessons(params);
      
      // Map domain entities to DTOs
      return {
        lessons: result.lessons.map(lesson => ({
          id: lesson.id,
          courseId: lesson.courseId,
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
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
            createdAt: lesson.content.createdAt,
            updatedAt: lesson.content.updatedAt,
            deletedAt: lesson.content.deletedAt,
          } : null,
          thumbnail: null, // Not available in domain entity
          duration: null, // Not available in domain entity
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt,
          deletedAt: lesson.deletedAt,
        })),
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message);
      }
      throw new ValidationError("Failed to fetch lessons");
    }
  }
}
