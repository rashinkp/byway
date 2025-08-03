import {
  IGetAllLessonsInputDTO,
  ILessonListOutputDTO,
} from "../../../dtos/lesson/lesson.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IGetAllLessonsUseCase } from "../interfaces/get-all-lessons.usecase.interface";

export class GetAllLessonsUseCase implements IGetAllLessonsUseCase {
  constructor(private readonly lessonRepository: ILessonRepository) {}

  async execute(params: IGetAllLessonsInputDTO): Promise<ILessonListOutputDTO> {
    try {
      return await this.lessonRepository.getAllLessons(params);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to fetch lessons", 500);
    }
  }
}
