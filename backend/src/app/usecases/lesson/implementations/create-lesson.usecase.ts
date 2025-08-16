import {
  ICreateLessonInputDTO,
  ILessonOutputDTO,
} from "../../../dtos/lesson.dto";
import { Lesson } from "../../../../domain/entities/lesson.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { ICreateLessonUseCase } from "../interfaces/create-lesson.usecase.interface";

export class CreateLessonUseCase implements ICreateLessonUseCase {
  constructor(private readonly lessonRepository: ILessonRepository) {}

  async execute(dto: ICreateLessonInputDTO): Promise<ILessonOutputDTO> {
    try {
      const existingLesson = await this.lessonRepository.findByCourseIdAndOrder(
        dto.courseId,
        dto.order
      );
      if (existingLesson) {
        throw new HttpError(
          `A lesson with order ${dto.order} already exists for course ${dto.title}`,
          400
        );
      }

      const lesson = Lesson.create(dto);
      const createdLesson = await this.lessonRepository.create(lesson);
      return createdLesson.toJSON() as unknown as ILessonOutputDTO;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to create lesson", 500);
    }
  }
}
