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
      return createdLesson.toJSON() as unknown as ILessonOutputDTO;
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
