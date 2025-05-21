import { ICreateLessonInputDTO, ILessonOutputDTO } from "../../../../domain/dtos/lesson/lesson.dto";
import { Lesson } from "../../../../domain/entities/lesson.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { ILessonRepository } from "../../../repositories/lesson.repository";
import { ICreateLessonUseCase } from "../interfaces/create-lesson.usecase.interface";


export class CreateLessonUseCase implements ICreateLessonUseCase {
  constructor(private readonly lessonRepository: ILessonRepository) {}

  async execute(dto: ICreateLessonInputDTO): Promise<ILessonOutputDTO> {
    try {
      const lesson = Lesson.create(dto);
      const createdLesson = await this.lessonRepository.create(lesson);
      return createdLesson.toJSON();
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to create lesson", 500);
    }
  }
}