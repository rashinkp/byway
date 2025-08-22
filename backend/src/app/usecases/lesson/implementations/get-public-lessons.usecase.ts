import {
  IGetPublicLessonsInputDTO,
  IPublicLessonListOutputDTO,
} from "../../../dtos/lesson.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IGetPublicLessonsUseCase } from "../interfaces/get-public-lessons.usecase.interface";

export class GetPublicLessonsUseCase implements IGetPublicLessonsUseCase {
  constructor(private readonly _lessonRepository: ILessonRepository) {}

  async execute(
    params: IGetPublicLessonsInputDTO
  ): Promise<IPublicLessonListOutputDTO> {
    try {
      return await this._lessonRepository.getPublicLessons(params);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to fetch public lessons", 500);
    }
  }
}
