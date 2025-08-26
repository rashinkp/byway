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
      return await this._lessonRepository.getPublicLessons(params);
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message);
      }
      throw new ValidationError("Failed to fetch public lessons");
    }
  }
}
