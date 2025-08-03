import { ILessonOutputDTO } from "../../../dtos/lesson/lesson.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { IGetLessonByIdUseCase } from "../interfaces/get-lesson-by-id.usecase.interface";

export class GetLessonByIdUseCase implements IGetLessonByIdUseCase {
  constructor(private readonly lessonRepository: ILessonRepository) {}

  async execute(id: string): Promise<ILessonOutputDTO> {
    try {
      const lesson = await this.lessonRepository.findById(id);
      if (!lesson || !lesson.isActive()) {
        throw new HttpError("Lesson not found or deleted", 404);
      }
      return lesson.toJSON();
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(
          error.message,
          error.message.includes("404") ? 404 : 400
        );
      }
      throw new HttpError("Failed to fetch lesson", 500);
    }
  }
}
