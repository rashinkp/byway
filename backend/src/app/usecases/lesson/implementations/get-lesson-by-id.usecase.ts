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
      return lesson.toJSON() as unknown as ILessonOutputDTO;
    } catch (error) {
      if (error instanceof LessonNotFoundError) {
        throw error;
      }
      throw new LessonNotFoundError("Failed to fetch lesson");
    }
  }
}
