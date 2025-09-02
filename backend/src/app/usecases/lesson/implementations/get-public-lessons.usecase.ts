import {
  IGetPublicLessonsInputDTO,
  IPublicLessonListOutputDTO,
} from "../../../dtos/lesson.dto";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IGetPublicLessonsUseCase } from "../interfaces/get-public-lessons.usecase.interface";
import { ValidationError } from "../../../../domain/errors/domain-errors";

export class GetPublicLessonsUseCase implements IGetPublicLessonsUseCase {
  constructor(private readonly _lessonRepository: ILessonRepository) {}

  async execute(
    params: IGetPublicLessonsInputDTO
  ): Promise<IPublicLessonListOutputDTO> {
    try {
      const result = await this._lessonRepository.getPublicLessons(params);
      
      // Map domain entities to DTOs
      return {
        lessons: result.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          thumbnail: null, // Not available in domain entity
          duration: null, // Not available in domain entity
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
      throw new ValidationError("Failed to fetch public lessons");
    }
  }
}
