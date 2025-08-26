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
      return await this._lessonRepository.getAllLessons(params);
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message);
      }
      throw new ValidationError("Failed to fetch lessons");
    }
  }
}
